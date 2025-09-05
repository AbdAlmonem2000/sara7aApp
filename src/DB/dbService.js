// src/DB/dbService.js

export const findOne = async ({ module, filter = {}, select = "", populate = [] }) => {
    return await module.findOne(filter).select(select).populate(populate);
};

export const find = async ({ module, filter = {}, select = "", populate = [] }) => {
    return await module.find(filter).select(select).populate(populate);
};

export const findById = async ({ module, id = "", select = "", populate = [] }) => {
    return await module.findById(id).select(select).populate(populate);
};

export const create = async ({ module, data = [{}], options = { validateBeforeSave: true } }) => {
    return await module.create(data, options);
};

export const updateOne = async ({ module, filter = {}, data = {}, options = { runValidators: true } }) => {
    return await module.updateOne(filter, data, options);
};

export const deleteOne = async ({ module, filter = {} }) => {
    return await module.deleteOne(filter);
};

export const findOneAndUpdate = async ({ module, filter = {}, data = {}, select = "", populate = [], options = { runValidators: true, new: true } } = {}) => {
    return await module.findOneAndUpdate(filter, { ...data, $inc: { __v: 1 } }, options).select(select).populate(populate);
};
