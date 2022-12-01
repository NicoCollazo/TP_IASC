# Open 1 shell and execute this:
minikube start
minikube kubectl -- apply -f ./kubernetes/
minikube dashboard

# In another shell run:
minikube minikube service tp-iasc-front --url