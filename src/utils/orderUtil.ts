const getOrderState = (state) => {
    switch (state) {
        case 0:
            return '待付款';
        case 1:
            return '已取消';
        case 2:
            return '备餐中';
        case 3:
            return '请取餐';
        case 4:
            return '已完成';
        default:
            return '未知状态';
    }
}

const getOrderStateMsg = (state) => {
    switch (state) {
        case 0:
            return '请尽快付款，我们将为您备餐';
        case 1:
            return '点餐流程已终止';
        case 2:
            return '正在火速备餐中，请耐心等待';
        case 4:
            return '期待您的下次光临';
        default:
            return '未知状态';
    }
}

export {
    getOrderState,
    getOrderStateMsg
}