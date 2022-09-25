import asyncio
import logging

#modified from https://docs.python.org/3/library/asyncio-protocol.html for reference

#change this to false for remote operation
is_local = True
web_UI_port = 5623
picam_port = 6005
loop = asyncio.get_event_loop()

class EchoServerClientProtocol(asyncio.Protocol):    
    def connection_made(self, transport):
        peername = transport.get_extra_info('peername')
        print('Protocol Connection from {}'.format(peername))
        self.transport = transport

    def data_received(self, data):
        message = data.decode()
        print('Protocol Data received: {!r}'.format(message))
        #print('Send: {!r}'.format(message))
        self.transport.write(data)
        #print('Close the client socket')
        self.transport.close()
       

    async def start_servers(self):
        # Each client connection will create a new protocol instance
        if is_local:
            self.server = await loop.create_server(EchoServerClientProtocol, '127.0.0.1', web_UI_port)
            # url = 'http://localhost:8081'
            # webbrowser.open(url)
        else:
            #empty string for address for ipv4 io
            self.server = await loop.create_server(EchoServerClientProtocol, '', web_UI_port)

    def close_server(self):
        # Close the server
        self.server.close()
        loop.run_until_complete(self.server.wait_closed())
        loop.close()

class EchoClientProtocol(asyncio.Protocol):
    def __init__(self, message, on_con_lost):
        self.message = message
        self.on_con_lost = on_con_lost

    def connection_made(self, transport):
        transport.write(self.message.encode())
        print('Data sent: {!r}'.format(self.message))

    def data_received(self, data):
        print('Data received: {!r}'.format(data.decode()))

    def connection_lost(self, exc):
        print('The server closed the connection')
        self.on_con_lost.set_result(True)

async def send_msg(message, addr, port):
    print('sending msg: ' + message)
    on_con_lost = loop.create_future()
    transport, protocol = await loop.create_connection(
        lambda: EchoClientProtocol(message, on_con_lost),
        addr, port)

    # Wait until the protocol signals that the connection
    # is lost and close the transport.
    try:
        await on_con_lost
    finally:
        transport.close()
