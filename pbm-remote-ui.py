"""
This code was written for python 3.8. 
it will likely need to be modified for other versions
"""

import os
#get path of current file
thedir = os.path.dirname(os.path.realpath(__file__))
print("thedir"+thedir)

import subprocess, asyncio, Echo_Transport_Service

#create a function for starting the nodejs server using python's subprocess
server_js_path = thedir + '/server.js'
async def start_node_server():
    subprocess.Popen(["node", server_js_path])  

if __name__ == '__main__':
    #set things up using asyncio
    #see python3.8 asyncio docs for reference
    loop = asyncio.get_event_loop()
    transport_server = Echo_Transport_Service.EchoServerClientProtocol()
    loop.create_task(transport_server.start_servers())
    loop.create_task(start_node_server())
    loop.run_forever()