import { Customer } from "../model/customerModel.js";
import { Op } from "sequelize"; 
// Lấy danh sách khách hàng
export const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll();
        if (customers.length === 0) {
            return res.status(404).json({ message: "Không có khách hàng nào" });
        }
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: "Khách hàng không tồn tại" });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addCustomer = async (req, res) => {
    try {
        const { partnerId, customerName, description, address, notes } = req.body;

        if (!customerName) {
            return res.status(400).json({ message: "Tên khách hàng là bắt buộc" });
        }
        const prefix = customerName.charAt(0).toUpperCase();
        const lastCustomer = await Customer.findOne({
            where: { customerId: { [Op.like]: `${prefix}%` } },
            order: [['customerId', 'DESC']]
        });

        let newId;
        if (lastCustomer) {
            const lastNumber = parseInt(lastCustomer.customerId.slice(1)) || 0;
            newId = `${prefix}${String(lastNumber + 1).padStart(4, '0')}`;
        } else {
            newId = `${prefix}0001`;
        }

        // Tạo khách hàng mới
        const newCustomer = await Customer.create({ customerId: newId, partnerId, customerName, description, address, notes });
        res.status(201).json(newCustomer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { partnerId, customerName, description, address, notes } = req.body;

        const customer = await Customer.findByPk(id);
        if (!customer) {
            return res.status(404).json({ message: "Khách hàng không tồn tại" });
        }

        customer.partnerId = partnerId;
        customer.customerName = customerName;
        customer.description = description;
        customer.address = address;
        customer.notes = notes;

        await customer.save();

        res.status(200).json({ message: "Cập nhật khách hàng thành công", customer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa khách hàng
export const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findByPk(id);

        if (!customer) {
            return res.status(404).json({ message: "Khách hàng không tồn tại" });
        }

        await customer.destroy();
        res.status(200).json({ message: "Xóa khách hàng thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
