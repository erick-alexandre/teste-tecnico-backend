import { Request, Response } from "express";
import { processJourneys } from "../services/journeyService";
import { createResponse } from "../utils/createResponse";

export function getJourneys(req: Request, res: Response) {
    try {
        const journeys = processJourneys()
        res.status(200).json(createResponse("Jornadas processadas com sucesso", true, journeys))
    }catch (error) {
        res.status(500).json(createResponse("Ocorreu um erro ao processar as jornadas", false, [], error))
    }
}