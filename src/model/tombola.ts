type ElementType = number;

export class ElementTombola {
    private value: ElementType;
    private extracted: boolean;

    public get Value(): ElementType { return this.value; }
    public get Extracted(): boolean { return this.extracted; }

    constructor(value: ElementType) {
        this.value = value;
        this.extracted = false;
    }

    public checkValue(value: ElementType): boolean {
        if (this.value === value) {
            this.extracted = true;
            return true;
        }
    }
}

export class RowTombola {
    private columns: ElementTombola[] = [];

    public get Columns(): ElementTombola[] { return this.columns; }

    constructor(
        columnsCount: number,
        randomNumber: boolean,
        offset?: number,
        blankSpaceCount?: number,
    ) {
        this.columns = Array(columnsCount)
            .fill(0)
            .map((_, i) => {
                const blankIndex = getRandomValues(columnsCount, blankSpaceCount);

                if (randomNumber) {
                    return blankIndex.some((v) => v == i + 1)
                        ? undefined
                        : getRandomValue(maxValue);
                } else {
                    return blankIndex.some((v) => v == i) ? undefined : offset + i + 1;
                }
            })
            .map((el) => (el ? new ElementTombola(el) : undefined));
    }

    public checkValue(value: ElementType): boolean {
        return this.columns.some((el) => el && el.checkValue(value));
    }
}

export class TableTombola {
    private rows: RowTombola[];

    public get Rows(): RowTombola[] { return this.rows; }

    constructor(
        rowsCount: number,
        columnsCount: number,
        randomNumber: boolean,
        blankSpaceCount?: number
    ) {
        this.rows = Array(rowsCount)
            .fill(0)
            .map((_, i) => new RowTombola(columnsCount, randomNumber, i * columnsCount, blankSpaceCount));
    }

    public checkValue(value: ElementType): boolean {
        return this.rows.some((row) => row.checkValue(value));
    }
}

export class Tombola {
    private users: Map<string, TableTombola[]> = new Map<string, TableTombola[]>();
    private mainTable: TableTombola;
    private extractedElements: ElementType[] = [];

    public get Users(): [string, TableTombola[]][] { return Array.from(this.users.entries()); }
    public get MainTable(): TableTombola { return this.mainTable; }
    public get ExtractedElements(): ElementType[] { return this.extractedElements; }

    constructor() {
        this.flush();
    }

    public flush() {
        this.extractedElements = [];
        this.users.clear();
        this.mainTable = new TableTombola(10, 9, false);
    }

    public extractNewElement(): string | undefined {
        if (this.extractedElements.length >= maxValue) {
            console.log("Maximun number of elements reached");
            return "Maximun number of elements reached";
        };

        const newValue = this.getRandomValue(maxValue);

        this.extractedElements = [...this.extractedElements, newValue].sort((a, b) => a - b);
        this.mainTable.checkValue(newValue);
        this.users.forEach(user => user.forEach(table => table.checkValue(newValue)));

        return undefined;
    }

    public createNewUserWithTables(user: string, tables: number) {
        if (this.users.has(user)) {
            return 'User already used. Please choose another username.';
        }

        this.users.set(user, Array(tables).fill(0).map(() => new TableTombola(3, 9, true, 4)));
    }

    private getRandomValue(maxValue: ElementType): ElementType {
        let newValue: ElementType;

        do {
            newValue = getRandomValue(maxValue);
        } while (this.extractedElements.includes(newValue));

        return newValue;
    }
}

function getRandomValues(maxValue: ElementType, totalNumbers: number): ElementType[] {
    const randomNumbers = new Set<ElementType>();

    if (maxValue < totalNumbers) return undefined; // error

    while (randomNumbers.size < totalNumbers) {
        randomNumbers.add(getRandomValue(maxValue));
    }

    return [...randomNumbers];
}

function getRandomValue(maxValue: ElementType): ElementType {
    return Math.floor(Math.random() * maxValue) + 1;
}

export const maxValue = 90;
