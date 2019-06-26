import {
    email,
    required,
    sameAs,
    minLength,
    maxLength
} from "vuelidate/lib/validators";

const limits = {
    nameLimits: { min: 1, max: 16 },
    passwordLimits: { min: 6, max: 30 }
}
export default {
    ...limits,
    validations: {
        name: {
            required,
            maxLength: maxLength(limits.nameLimits.max)
        },
        password: {
            required,
            minLength: minLength(limits.passwordLimits.min),
            maxLength: maxLength(limits.passwordLimits.max)
        },
        repeatPassword: {
            sameAs: sameAs("password")
        },
        email: {
            required,
            email
        }
    }
};