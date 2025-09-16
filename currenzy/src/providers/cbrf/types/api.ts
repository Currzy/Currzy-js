export interface CbrfValute {
    CharCode: string;
    Nominal: string;
    Name: string;
    Value: string;
}

export interface CbrfData {
    ValCurs: {
        Valute: CbrfValute[] | CbrfValute;
    };
}
