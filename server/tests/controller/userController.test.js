const { get_court_price } = require('../../controllers/courtcontroller');

jest.mock('../../models/courts', () => ({
    findOne: jest.fn().mockResolvedValue({ nightPrice: 60, dayPrice: 30 })
}));


describe("get_court_price function", () => {
    it("should return night price after 6 PM", async () => {
        const price = await get_court_price("CourtA", new Date("2024-05-06T20:00:00Z").getHours());
        expect(price).toBe(60);
    });

    it("should return day price before 6 PM", async () => {
        const price = await get_court_price("CourtA",  new Date("2024-05-06T10:00:00Z").getHours());
        expect(price).toBe(30);
    });
});
