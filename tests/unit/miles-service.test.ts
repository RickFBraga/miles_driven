import { findMiles, saveMiles } from "repositories/miles-repository";
import { calculateMiles } from "services/miles-calculator-service";
import { generateMilesForTrip, getMilesFromCode } from "services/miles-service";
import { AffiliateStatus, ServiceClass, Trip } from "protocols";

class CustomError extends Error {
    type: string;

    constructor(type: string, message: string) {
        super(message);
        this.type = type;
        this.name = this.constructor.name;
    }
}

jest.mock("../../src/repositories/miles-repository");
jest.mock("../../src/services/miles-calculator-service");

describe("generateMilesForTrip", () => {
    const trip: Trip = {
        code: '123456',
        origin: { lat: 40.7128, long: -74.0060 },
        destination: { lat: 34.0522, long: -118.2437 },
        miles: false,
        plane: "Boeing 737",
        service: "ECONOMIC" as ServiceClass,
        affiliate: "SILVER" as AffiliateStatus,
        date: "2024-12-28"
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should generate miles and save them if no miles are registered for the trip", async () => {
        (findMiles as jest.Mock).mockResolvedValueOnce(null);
        (calculateMiles as jest.Mock).mockReturnValueOnce(7380);

        const miles = await generateMilesForTrip(trip);

        expect(miles).toBe(7380);
        expect(saveMiles).toHaveBeenCalledWith(trip.code, 7380); 
    });

    it("should throw an error if miles are already registered for the trip", async () => {
        (findMiles as jest.Mock).mockResolvedValueOnce({ id: 1, code: trip.code, miles: 7380 });

        await expect(generateMilesForTrip(trip)).rejects.toEqual({
            type: "conflict",
            message: `Miles already registered for code ${trip.code}`
        });
    });
});

describe("getMilesFromCode", () => {
    it("should return miles when found for the given code", async () => {
        const tripCode = "ABC123";
        const miles = 7380;
        (findMiles as jest.Mock).mockResolvedValueOnce({ id: 1, code: tripCode, miles });

        const result = await getMilesFromCode(tripCode);

        expect(result).toEqual({ id: 1, code: tripCode, miles });
    });

    it("should throw an error if miles are not found for the given code", async () => {
        const tripCode = "ABC123";
        (findMiles as jest.Mock).mockResolvedValueOnce(null);

        await expect(getMilesFromCode(tripCode)).rejects.toEqual({
            type: "not_found",
            message: `Miles not found for code ${tripCode}`
        });
    });
});
