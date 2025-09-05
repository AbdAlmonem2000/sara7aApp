import { role } from "../../DB/models/user.model.js";




export const endPoints = {
    getProfile: [role.admin, role.user],
    updateProfile: [role.admin, role.user],
    freezeAcount: [role.admin, role.user],
    restoreAcount: [role.admin],
    hardDeletedAcount: [role.admin],
    updatePassword: [role.admin, role.user],
}; 