import moment from "moment";



export const formatDate = (date: Date | string | number | null | undefined) => {
    if (!date) return '';
    const numericDate = typeof date === 'string' ? Number(date) : date;
    if (isNaN(Number(numericDate))) {
        return 'Invalid Date';
    }
    const dateFormated = moment(numericDate).format('DD/MM/YYYY HH:mm:ss');
    return dateFormated;
};