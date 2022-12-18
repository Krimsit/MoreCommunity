"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NodeMediaServer = require('node-media-server');
exports.default = (io) => {
    const config = {
        rtmp: {
            port: 1935,
            chunk_size: 60000,
            gop_cache: true,
            ping: 30,
            ping_timeout: 60
        },
        http: {
            port: process.env.RTMP_SERVER_PORT,
            mediaroot: '../../',
            allow_origin: '*'
        },
        trans: {
            ffmpeg: '/usr/bin/ffmpeg',
            tasks: [
                {
                    app: 'live',
                    hls: true,
                    hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
                    dash: true,
                    dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
                }
            ]
        }
    };
    const server = new NodeMediaServer(config);
    // server.run()
};
