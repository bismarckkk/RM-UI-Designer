import React, { useEffect, useMemo, useState } from 'react';
import { Button, Modal, Space } from 'antd';
import Markdown from 'react-markdown';
import { isNightly } from '@/utils/utils';

type ReleaseInfo = {
    version: string;
    body: string;
};

const STORAGE_KEY = 'version_release_seen';
const REPO = 'bismarckkk/RM-UI-Designer';

function extractSemver(version: string) {
    const match = version.match(/(\d+)\.(\d+)\.(\d+)/);
    if (!match) {
        return null;
    }
    return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function compareSemver(a: string, b: string) {
    const av = extractSemver(a) ?? [0, 0, 0];
    const bv = extractSemver(b) ?? [0, 0, 0];
    if (av[0] !== bv[0]) {
        return av[0] - bv[0];
    }
    if (av[1] !== bv[1]) {
        return av[1] - bv[1];
    }
    return av[2] - bv[2];
}

async function fetchReleaseByTag(tag: string): Promise<ReleaseInfo | null> {
    const response = await fetch(`https://api.github.com/repos/${REPO}/releases/tags/${encodeURIComponent(tag)}`);
    if (!response.ok) {
        return null;
    }
    const data = await response.json();
    return {
        version: data.tag_name || tag,
        body: data.body || ''
    };
}

const StartupReleaseModal = () => {
    const appVersion = useMemo(() => process.env.VERSION ?? '', []);
    const [open, setOpen] = useState(false);
    const [releaseInfo, setReleaseInfo] = useState<ReleaseInfo | null>(null);
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        if (!open || countdown <= 0) {
            return;
        }
        const timer = setTimeout(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
    }, [open, countdown]);

    useEffect(() => {
        if (!appVersion || appVersion === 'development' || isNightly()) {
            return;
        }

        const savedVersion = localStorage.getItem(STORAGE_KEY) ?? '0.0.0';
        if (compareSemver(appVersion, savedVersion) <= 0) {
            return;
        }

        (async () => {
            let release = await fetchReleaseByTag(appVersion);
            if (!release) {
                release = await fetchReleaseByTag(`v${appVersion}`);
            }
            if (!release) {
                return;
            }

            setReleaseInfo(release);
            setCountdown(3);
            setOpen(true);
        })();
    }, [appVersion]);

    const handleClose = () => {
        if (countdown > 0) {
            return;
        }
        localStorage.setItem(STORAGE_KEY, appVersion);
        setOpen(false);
    };

    return (
        <Modal
            title="Release Notes"
            open={open}
            onCancel={handleClose}
            closable={countdown <= 0}
            maskClosable={countdown <= 0}
            zIndex={2100}
            style={{ maxHeight: 600 }}
            styles={{
                body: {
                    maxHeight: 480,
                    overflowY: 'auto'
                }
            }}
            footer={
                <Space>
                    <Button type="primary" onClick={handleClose} disabled={countdown > 0}>
                        {countdown > 0 ? `Close (${countdown}s)` : 'Close'}
                    </Button>
                </Space>
            }
        >
            <Markdown
                components={{
                    a: ({ node, ...rest }) => <a {...rest} target="_blank" rel="noreferrer" />
                }}
            >
                {releaseInfo?.body || `## ${releaseInfo?.version || appVersion}`}
            </Markdown>
        </Modal>
    );
};

export default StartupReleaseModal;
