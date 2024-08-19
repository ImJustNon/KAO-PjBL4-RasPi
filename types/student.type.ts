export type ResponseStatus = "OK" | "FAIL";

export type StudentInfoResponseData = {
    student_id: string;
    student_prefix: string;
    student_nickname: string;
    student_firstname: string;
    student_lastname: string;
}

export type StudentResponseData = {
    status: ResponseStatus;
    message: string;
    data?: StudentInfoResponseData;
}