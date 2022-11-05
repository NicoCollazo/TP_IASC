const ServerStatus = ({ data, idx }) => {
	return <div key={`Server_${data.name}_${idx}`}>{JSON.stringify(data)}</div>;
};

export default ServerStatus;
