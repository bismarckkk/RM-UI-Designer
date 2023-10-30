import { RuntimeAntdConfig } from 'umi';
import { theme } from 'antd';

export const antd: RuntimeAntdConfig = (memo) => {
    memo.theme ??= {};
    memo.theme.algorithm = theme.compactAlgorithm; // 配置 antd5 的预设 dark 算法

    return memo;
}
