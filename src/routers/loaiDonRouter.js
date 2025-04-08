import express from 'express';
import {
    getAllLoaiDon,
    getLoaiDonById,
    createLoaiDon,
    updateLoaiDon,
    deleteLoaiDon
} from '../controllers/loaiDonController.js';

const router = express.Router();

router.post('/applicationtype/all', getAllLoaiDon);
router.post('/applicationtype/detail', getLoaiDonById);
router.post('/applicationtype/add', createLoaiDon);
router.put('/applicationtype/edit', updateLoaiDon);
router.post('/applicationtype/delete', deleteLoaiDon);

export default router;
