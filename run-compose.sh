# Back
echo "Building Backend Service..."
docker build --rm -t tp_iasc/back .

# Front
cd ./front 
echo "Building FrontEnd Service..."
docker build --rm -t tp_iasc/front .
cd .. 

# Compose
docker compose up