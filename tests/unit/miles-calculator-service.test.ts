import { calculateMiles } from "services/miles-calculator-service";
import { ServiceClass, AffiliateStatus, Trip } from "protocols";

jest.mock("../../src/services/distances-calculator-service", () => ({
    calculateDistance: jest.fn().mockReturnValue(2445)
}));

describe("calculateMiles", () => {
    it("should calculate miles correctly when all conditions are applied", () => {
        const trip: Trip = {
            code: '123456',
            origin: { lat: 40.7128, long: -74.0060 },
            destination: { lat: 34.0522, long: -118.2437 },
            miles: false,
            plane: "Boeing 737",
            service: "ECONOMIC_PREMIUM" as ServiceClass,
            affiliate: "SILVER" as AffiliateStatus,
            date: "2024-05-15"
        };

        const miles = calculateMiles(trip);

        expect(miles).toBe(3698);
    });

    it("should return 0 miles if 'miles' is true", () => {
        const trip: Trip = {
            code: '123456',
            origin: { lat: 40.7128, long: -74.0060 },
            destination: { lat: 34.0522, long: -118.2437 },
            miles: true,
            plane: "Boeing 737",
            service: "ECONOMIC" as ServiceClass,
            affiliate: "BRONZE" as AffiliateStatus,
            date: "2024-05-15"
        };

        const miles = calculateMiles(trip);

        expect(miles).toBe(0);
    });
});
