import { Product } from "../model/productModel.js";

// Lấy tất cả sản phẩm
export const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        if (products.length === 0) {
            return res.status(404).json({ message: "Không có sản phẩm nào" });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy sản phẩm theo ID
export const getProductByIdController = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm sản phẩm
export const addProductController = async (req, res) => {
    try {
        const { name, price } = req.body;
        if (!name || !price) {
            return res.status(400).json({ message: "Tên và giá sản phẩm là bắt buộc" });
        }
        const newProduct = await Product.create({ name, price });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật sản phẩm
export const updateProductController = async (req, res) => {
    try {
        const { name, price } = req.body;
        const { id } = req.params;

        if (!name || !price) {
            return res.status(400).json({ message: "Tên và giá sản phẩm là bắt buộc" });
        }

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }

        product.name = name;
        product.price = price;
        await product.save();

        res.status(200).json({ message: "Cập nhật sản phẩm thành công", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa sản phẩm
export const deleteProductController = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }

        await product.destroy();
        res.status(200).json({ message: "Xóa sản phẩm thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
