module.exports = {
	LIFECYCLE : {
		START : "start",
		AFTER_START : "after_start",
		STOP : "stop"
	},
	EVENT : {
		TCP_CONNECTED : "tcp_connected",
		TCP_CLOSED : "tcp_closed",
		PACKET_PARSING : "package_parsing",
		UDP_PACKET_PARSING : "udp_package_parsing",
		PROCESS_PACKET : "process_packet",
		RECV_CHILD_MESSAGE : "recv_child_message",
		WEBSOCKET_CONNECTED : "websocket_connected",
		WEBSOCKET_CLOSED : "websocket_closed"
	},
	BUFFER : {
		INPUT_SIZE : 5 * 1024 * 1024
	},
	PACKET_FORMAT : {
		HEAD : 32,
		LEN : 4,
		TAIL : 16
	},
	COMPONENT : {
		TCP_SESSION : "tcp_session",
		TCP_SESSION_MGR : "tcp_session_mgr",
		STREAM_PARSER : "stream_parser",
		DGRAM_PARSER : "dgram_parser",
		MASTER_PROCESS : "master_process",
		WS_SESSION_MGR : "ws_session_mgr",
		WS_SESSION : "ws_session"
	},
	COMPONENT_LEGO : {
		TCP_SESSION : "/framework/session/tcp_session",
		TCP_SESSION_MGR : "/framework/session/tcp_session_mgr",
		WS_SESSION : "/framework/session/ws_session",
		WS_SESSION_MGR : "/framework/session/ws_session_mgr",
		PARSER : "/framework/packet_parser/parser",
		DGRAM_PARSER : "/framework/packet_parser/dgram_parser",
		TRANSFER_PARSER : "/framework/packet_parser/transfer_parser",
		MASTER_PROCESS : "/framework/ipc/master"
	},
	IPC : {

	},
	SOCKET_TYPE : {
		SOCKET : 0,
		WEBSOCKET : 1,
		UDP_SOCKET : 2
	}
}
