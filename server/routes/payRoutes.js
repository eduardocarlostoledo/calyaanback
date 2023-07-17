import express from "express";
import { payPreference, create_Preference, feedbackSuccess, feedbackPending, feedbackFailure, payPreferenceManual, feedbackSuccessManual, feedbackFailureManual, feedbackPendingManual, updatePayOrder, liberarReserva, agendarOrden } from "../controllers/payController.js";

const payRouter = express.Router();

payRouter.post("/preference", payPreference);
payRouter.post("/preference-manual", payPreferenceManual);
payRouter.post("/create_preference/:orderId", create_Preference);
payRouter.get("/feedback/success", feedbackSuccess);
payRouter.get("/feedback/failure", feedbackFailure);
payRouter.get("/feedback/pending", feedbackPending);
payRouter.get("/feedback/success/manual", feedbackSuccessManual);
payRouter.get("/feedback/failure/manual", feedbackFailureManual);
payRouter.get("/feedback/pending/manual", feedbackPendingManual);
payRouter.post("/finish/order", updatePayOrder);
payRouter.post("/finish/liberar", liberarReserva);
payRouter.post("/finish/agendar", agendarOrden);


export default payRouter;