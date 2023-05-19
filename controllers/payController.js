import mercadopago from "mercadopago";
import PerfilProfesional from "../models/ProfessionalModel.js";
import Usuario from "../models/UserModel.js";
import saveOrder from "./orderController.js";
import Producto from "../models/ProductModel.js";
import Orden from "../models/OrderModel.js";
import { emailCompra, emailProfesional } from "../helpers/emails.js";

// let arrayPreference = {};
const payPreference = async (req, res) => {
  try {

    const { DateService, ProfessionalService, profile, services, dataCustomer } = req.body;
    const parsedProfile = JSON.parse(profile);
    const parsedServices = JSON.parse(services);
    const parsedProfessionalService = JSON.parse(ProfessionalService);
    const parsedDateService = JSON.parse(DateService);
    const parsedData_customer = JSON.parse(dataCustomer);

    const profesional = await Usuario.findOne({ profesional: parsedProfessionalService.profesional_id });

    const serviciosIds = parsedServices.map(service => service.idWP);

    const servicios = await Producto.findOne({ idWP: { $in: serviciosIds } });

    const arrayPreference = {
      cliente_id: parsedProfile._id,
      cliente_email: parsedProfile.email,
      cliente_nombre: parsedData_customer.firstName,
      cliente_apellido: parsedData_customer.lastName,
      cliente_cedula: parsedData_customer.cedula,
      cliente_telefono: parsedData_customer.telefono,
      user_profesional_id: parsedProfessionalService.profesional_user_id,
      profesional_id: parsedProfessionalService.profesional_id,
      profesional_email: profesional.email,
      profesional_nombre: profesional.nombre,
      profesional_apellido: profesional.apellido,
      profesional_telefono: profesional.telefono,
      servicio: servicios.nombre,
      servicio_img: servicios.img,
      cantidad: parseInt(serviciosIds.length, 10),
      precio: parseInt(servicios.precio, 10),
      dia_servicio: parsedDateService.date,
      hora_servicio: parsedDateService.time,
      direccion_Servicio: parsedData_customer.address,
      adicional_direccion_Servicio: parsedData_customer.address2,
      ciudad_Servicio: parsedData_customer.ciudad,
      localidad_Servicio: parsedData_customer.localidad,
      telefono_Servicio: parsedData_customer.telefono,
    };

    const newOrder = await saveOrder(arrayPreference);

    const usuario = await Usuario.findOne({ _id: arrayPreference.cliente_id });
    const profesionalService = await PerfilProfesional.findOne({ _id: arrayPreference.profesional_id })
    usuario.reservas = [...usuario.reservas, newOrder._id]
    profesionalService.reservas = [...profesionalService.reservas, newOrder._id]

    await usuario.save()
    await profesionalService.save()


    res.send({ newOrder: newOrder._id });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};


const create_Preference = (req, res) => {

  const orderId = req.params.orderId;
  let preference = {
    items: [
      {
        title: req.body.description,
        unit_price: Number(req.body.price),
        quantity: Number(req.body.quantity),
      },
    ],
    back_urls: {
      success: `${process.env.BACK}/pay/feedback/success`,
      failure: `${process.env.BACK}/pay/feedback/failure`,
      pending: `${process.env.BACK}/pay/feedback/pending`,
    },
    auto_return: "approved",

    "payment_methods": {
      "excluded_payment_types": [
        {
          "id": "ticket"
        },
        {
          "id": "bank_transfer"
        }
      ],
    },
    "statement_descriptor": "CALYAAN COLOMBIA",
    "external_reference": `${orderId}`,
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      res.send({
        id: response.body.id,
        data: response.body.items,
      });
    })
    .catch(function (error) {
      console.log(error);
    });
};

const feedbackSuccess = async (req, res) => {

  try {

    const { payment_id, status, payment_type, merchant_order_id, external_reference } = req.query;


    const order = await Orden.findById(external_reference);

    order.payment_id = payment_id;
    order.estadoPago = status;
    order.payment_type = payment_type;
    order.merchant_order_id = merchant_order_id;

    await order.save();

    await emailCompra(order)
    await emailProfesional(order)

    res.redirect(`${process.env.FRONT}/resumen/${external_reference}`)


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error in success route" });
  }
};



const feedbackPending = async (req, res) => {

  try {
    const { payment_id, status, payment_type, merchant_order_id, external_reference } = req.query;

    const order = await Orden.findById(external_reference);

    order.payment_id = payment_id;
    order.estadoPago = status;
    order.payment_type = payment_type;
    order.merchant_order_id = merchant_order_id;

    await order.save();

    await emailCompra(order)
    await emailProfesional(order)

    res.redirect(`${process.env.FRONT}/resumen/${external_reference}`)

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error in pending route" });
  };
}

const feedbackFailure = async (req, res) => {

  try {
    const { payment_id, status, payment_type, merchant_order_id, external_reference } = req.query;

    const order = await Orden.findById(external_reference);

    if (status === "null") {
      order.estadoPago = "rejected"
      order.payment_id = payment_id;
      order.payment_type = payment_type;
      order.merchant_order_id = merchant_order_id;

      await order.save();
      // await emailCompra(order)
      // await emailProfesional(order)

      res.redirect(`${process.env.FRONT}/servicios`)
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error in failure" });
  };
};



const payPreferenceManual = async (req, res) => {
  try {

    const { usuario, serviciosIds, cliente_id, cantidad, precio, direccion_Servicio, adicional_direccion_Servicio, ciudad_Servicio, localidad_Servicio, telefono_Servicio } = req.body;

    console.log(cliente_id)

    let usuarioNuevo = await Usuario.findOne({ _id: cliente_id });

    console.log(usuarioNuevo)

    if (!usuarioNuevo) {
      const error = new Error("El usuario no esta registrado");
      return res.status(404).json({ msg: error.message });
    }

    const updateUsuario = await Usuario.findOneAndUpdate({ _id: cliente_id }, {
      nombre: usuario.cliente_nombre,
      apellido: usuario.cliente_apellido,
      cedula: usuario.cliente_cedula,
      telefono: usuario.cliente_telefono
    }, { new: true })

    const serviciosSearch = await Producto.findOne({ idWP: { $in: serviciosIds } });

    const arrayPreference = {
      cliente_id: updateUsuario._id,
      cliente_email: updateUsuario.email,
      cliente_nombre: updateUsuario.nombre,
      cliente_apellido: updateUsuario.apellido,
      cliente_cedula: updateUsuario.cedula,
      cliente_telefono: updateUsuario.telefono,
      servicio: serviciosSearch.nombre,
      servicio_img: serviciosSearch.img,
      cantidad: cantidad,
      precio: precio,
      direccion_Servicio,
      adicional_direccion_Servicio,
      ciudad_Servicio,
      localidad_Servicio,
      telefono_Servicio,
    };

    const newOrder = await new Orden(arrayPreference)

    await newOrder.save()

    usuarioNuevo.reservas = [...usuarioNuevo.reservas, newOrder._id]

    await usuarioNuevo.save()

    res.send({ newOrder: newOrder._id });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};


const feedbackSuccessManual = async (req, res) => {

  try {

    const { payment_id, status, payment_type, merchant_order_id, external_reference } = req.query;

    const order = await Orden.findById(external_reference);

    order.payment_id = payment_id;
    order.estadoPago = status;
    order.payment_type = payment_type;
    order.merchant_order_id = merchant_order_id;

    await order.save();

    res.redirect(`${process.env.FRONT}/resumen/${external_reference}`)

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error in success route" });
  }
};

const feedbackPendingManual = async (req, res) => {

  try {
    const { payment_id, status, payment_type, merchant_order_id, external_reference } = req.query;

    const order = await Orden.findById(external_reference);

    order.payment_id = payment_id;
    order.estadoPago = status;
    order.payment_type = payment_type;
    order.merchant_order_id = merchant_order_id;

    await order.save();

    res.redirect(`${process.env.FRONT}/resumen/${external_reference}`)

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error in pending route" });
  };
}

const feedbackFailureManual = async (req, res) => {

  try {
    const { payment_id, status, payment_type, merchant_order_id, external_reference } = req.query;

    const order = await Orden.findById(external_reference);

    if (status === "null") {
      order.estadoPago = "rejected"
      order.payment_id = payment_id;
      order.payment_type = payment_type;
      order.merchant_order_id = merchant_order_id;

      await order.save();

      res.redirect(`${process.env.FRONT}/servicios`)
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error in failure" });
  };
};

const updatePayOrder = async (req, res) => {

  try {
    const { _id } = req.body;

    const order = await Orden.findOneAndUpdate({ _id }, { ...req.body }, { new: true });

    await emailCompra(order)
    await emailProfesional(order)

    res.status(200).json({ msg: "Orden agendada correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error in failure" });
  };
};


export {
  payPreference,
  create_Preference,
  feedbackSuccess,
  feedbackPending,
  feedbackFailure,
  payPreferenceManual,
  feedbackSuccessManual,
  feedbackPendingManual,
  feedbackFailureManual,
  updatePayOrder
};