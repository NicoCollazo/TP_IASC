# Back
docker build -t tp_iasc/back .

# Front
cd ./front

docker build -t tp_iasc/front .

# Restore shell to root.
cd ..

docker compose up