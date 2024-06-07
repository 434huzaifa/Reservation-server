import { Router } from "express";
import { pdfGenerator } from "../handler";

const router=Router()

router.post('/pdfgen',pdfGenerator)

export default router