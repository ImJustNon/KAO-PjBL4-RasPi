import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();

export async function StartAlert(req: Request, res: Response): Promise<void> {
    const checkRemainingStudent = await prisma.student.findMany();
    
}