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

    public markValueExtraced(value: ElementType) {
        if (this.value === value) {
            this.extracted = true;
        }
        return this.extracted;
    }
}

export class RowTombola {
    private configurationRangeColumnMap = new Map<number, [number, number]>();
    private columns: ElementTombola[] = [];

    public get Columns(): ElementTombola[] { return this.columns; }

    constructor(
        columnsCount: number,
        randomNumber: boolean,
        offset?: number,
        blankSpaceCount?: number,
    ) {
        this.configureRangeColumnMap();

        const blankIndex = getRandomValues(columnsCount, blankSpaceCount);

        this.columns = Array(columnsCount)
            .fill(0)
            .map((_, i) => {

                if (randomNumber) {
                    const range = this.configurationRangeColumnMap.get(i);

                    return blankIndex.includes(i + 1)
                        ? undefined
                        : getRandomValue(range[1] - range[0] + 1) + range[0] - 1;
                } else {
                    return blankIndex.includes(i + 1) ? undefined : offset + i + 1;
                }
            })
            .map((el) => (el ? new ElementTombola(el) : undefined));
    }

    private configureRangeColumnMap() {
        this.configurationRangeColumnMap.set(0, [1, 9]);
        this.configurationRangeColumnMap.set(1, [10, 19]);
        this.configurationRangeColumnMap.set(2, [20, 29]);
        this.configurationRangeColumnMap.set(3, [30, 39]);
        this.configurationRangeColumnMap.set(4, [40, 49]);
        this.configurationRangeColumnMap.set(5, [50, 59]);
        this.configurationRangeColumnMap.set(6, [60, 69]);
        this.configurationRangeColumnMap.set(7, [70, 79]);
        this.configurationRangeColumnMap.set(8, [80, 90]);
    }

    public checkValue(value: ElementType): boolean {
        return this.columns.map(el => {
            if (el) {
                return el.markValueExtraced(value);
            }
            else return true;
        }).every(el => el);
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
        const wonUsers = Array.from(this.users.entries())
            .filter(([user, userTables]) => userTables.some(table => table.checkValue(newValue)))
            .map(([user, userTables]) => user);

        return wonUsers.length > 0 ? wonUsers.join(', ') : undefined;
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
