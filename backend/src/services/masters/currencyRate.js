const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

const CurrencyRate = require("../../../model/masters/currencyRate");

const currencyRateServices = {
    create: async (data) => {
        const { country } = data;

        const countryExist = await CurrencyRate.findOne({ country });
        if (countryExist) {
            throw {
                status: false,
                message: "Country already exists",
            };
        }


        const newStatus = await CurrencyRate.create({
            ...data
        });

        return newStatus;
    },

    bulkUploadCurrencyRate: async (file, userId, userName) => {

        const workbook = xlsx.readFile(file);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });

        if (!rows || rows.length === 0) {
            return res.status(400).json({ message: "Uploaded sheet is empty." });
        }



        const created = [];
        const updated = [];

        for (const row of rows) {
            const country = row.country?.trim();
            const currencyCode = row.currencyCode?.trim();

            if (!country || !currencyCode) {
                continue; // Skip invalid rows
            }

            const existing = await CurrencyRate.findOne({
                country,
                currencyCode,
            });

            const updateData = {
                country,
                currencyName: row.currencyName?.trim(),
                currencyCode,
                INRvalue: Number(row.INRvalue) || 0,
                updated_by: userId,
                updatedByName: userName,
            };

            if (existing) {
                await CurrencyRate.findByIdAndUpdate(existing._id, updateData, { new: true });
                updated.push(currencyCode);
            } else {
                await CurrencyRate.create({
                    ...updateData,
                    created_by: userId,
                    createdByName: userName,
                });
                created.push(currencyCode);
            }
        }

        fs.unlink(file, () => { });

        return "Currency rates uploaded successfully.";

    },

    getAll: async (searchText = "") => {
        const query = {};

        if (searchText) {
            query.$or = [
                { currencyName: { $regex: searchText, $options: "i" } },
                { country: { $regex: searchText, $options: "i" } }
            ];
        }

        const allCurrencyRates = await CurrencyRate.find(query)
            .populate({ path: "created_by", select: "name" })
            .sort({ createdAt: -1 });

        return allCurrencyRates;
    },


    getById: async (id) => {
        const getOne = await CurrencyRate.findById(id);
        if (!getOne) {
            throw { status: false, message: "currencyRate not found" };
        }
        return getOne;
    },


    update: async (id, data, userId, userName) => {
        const { country } = data;


        if (country) {
            const exist = await CurrencyRate.findOne({
                country,
                _id: { $ne: id }
            });
            if (exist) {
                throw { status: false, message: "Country already exists" };
            }
        }


        const updatedStatus = await CurrencyRate.findByIdAndUpdate(
            id,
            {
                ...data,
                updated_by: userId,
                updatedByName: userName
            },
            { new: true }
        );

        return updatedStatus;
    },

    delete: async (id) => {
        const deleted = await CurrencyRate.findByIdAndDelete(id);
        if (!deleted) {
            throw {
                status: false,
                message: "Currency rate not found or already deleted",
            };
        }
        return "currency rate deleted successfully";
    },
};

module.exports = currencyRateServices;
