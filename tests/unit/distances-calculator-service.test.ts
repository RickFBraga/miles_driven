import { calculateDistance, applyHaversineFormula } from "services/distances-calculator-service";

describe("applyHaversineFormula", () => {
    it("should calculate the distance between two coordinates correctly", () => {
        const lat1 = 40.7128, lon1 = -74.0060;
        const lat2 = 34.0522, lon2 = -118.2437;
        const radius = 3958.8;

        const result = applyHaversineFormula(lat1, lat2, lat1 - lat2, lon1 - lon2, radius);
        const expected = 1772.1449108562504;

        expect(result).toBeCloseTo(expected, 2);
    });
});

describe("calculateDistance", () => {
    it("should calculate distance in miles when isMiles is true", () => {

        const coords1 = { lat: 40.7128, long: -74.0060 };
        const coords2 = { lat: 34.0522, long: -118.2437 };

        const result = calculateDistance(coords1, coords2, true);
        const expected = 2446;

        expect(result).toBeCloseTo(expected, 2);
    });

    it("should calculate distance in kilometers when isMiles is false", () => {
        const coords1 = { lat: 40.7128, long: -74.0060 };
        const coords2 = { lat: 34.0522, long: -118.2437 };

        const result = calculateDistance(coords1, coords2, false);
        const expected = 3936;

        expect(result).toBeCloseTo(expected, 2);
    });

    it("should handle small distances correctly", () => {
        const coords1 = { lat: 40.7128, long: -74.0060 };
        const coords2 = { lat: 40.7138, long: -74.0061 };

        const result = calculateDistance(coords1, coords2, false);
        const expected = 0;

        expect(result).toBeCloseTo(expected, 2);
    });
});
