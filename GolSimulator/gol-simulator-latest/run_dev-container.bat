docker run -d --name gol-node ^
    -v C:\Users\v.sesum\Documents\workspace\playground\gol:/app ^
    -p 8085:8081 ^
    --restart unless-stopped  ^
    node-with-rust