# Back
docker build --rm -t tp_iasc/back .

# Front
cd ./front

docker build --rm -t tp_iasc/front .

# Restore shell to root.
cd ..

docker compose up