import { RuntimeAntdConfig } from 'umi';
import { theme } from 'antd';

export const antd: RuntimeAntdConfig = (memo) => {
    memo.theme ??= {};
    memo.theme.algorithm = theme.compactAlgorithm;

    return memo;
}
