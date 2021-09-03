import React, { useEffect, useState } from "react";
import { BlobProvider, pdf } from "@react-pdf/renderer";
import Document from "./Document";
import print from "print-js";
import Loader from "./component/loader/loader";
import axios from "axios";
import { useAlert } from "react-alert";

const App = () => {
	const [ready, setReady] = useState(false);
	const [isPrint, showPrint] = useState(false);
	const [payment, setPayment] = useState({});
	const alert = useAlert();
	const id = window.location.pathname.split("/")[1];
	const noId = id !== "";

	console.log({ id, EV: process.env.REACT_APP_IS_PROD, ready, payment });

	useEffect(() => {
		axios
			.get(
				process.env.NODE_ENV === "production"
					? "https://stagingbackend.psirs.gov.ng/payments/get_payment_detail?id=" +
							id
					: "http://test-psirs-backend-server.eu-west-2.elasticbeanstalk.com/payments/get_payment_detail?id=" +
							id
			)
			.then((res) => {
				if (res.status === 200 && res.data < 1) {
					id && alert.error("The payment does not exit !");
					setPayment({});
					setTimeout(() => {
						window.history.back();
					}, 2000);
					return;
				}
				if (res.status === 200) {
					setPayment(res.data[0]);
				}
			})
			.catch((error) => {
				alert.error("Error Occurred");
				setTimeout(() => {
					window.history.back();
				}, 2000);
			});
	}, [id, alert]);

	useEffect(() => {
		setTimeout(() => {
			setReady(true);
		}, 3000);
	}, []);

	const printDoc = async () => {
		const blob = await pdf(<Document payment={payment} />).toBlob();
		print(URL.createObjectURL(blob));
	};

	if (isPrint && ready && Object.keys(payment).length > 0) {
		printDoc();
	}

	return (
		<BlobProvider document={<Document payment={payment} />}>
			{({ url, loading, error }) => {
				if (loading) {
					return (
						<div
							style={{
								height: "100vh",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Loader />
							<h1 style={{ marginLeft: "10px" }}>Generating receipt</h1>
						</div>
					);
				}

				if (!loading) {
					showPrint(true);
				}

				if (!loading) {
					return (
						<div
							style={{
								height: "100vh",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								flexDirection: "column",
							}}
						>
							{Object.keys(payment).length < 1 && (
								<h1 style={{ color: "red" }}>
									{noId ? "Invalid receipt" : " Welcome"}
								</h1>
							)}
							<img
								style={{ width: "auto", height: "300px" }}
								src="./logo-.png"
								alt=""
							/>
							{noId && (
								<div>
									<div style={styles} onClick={printDoc}>
										PRINT
									</div>
									<a style={styles} href={url} download={`payment-receipt.pdf`}>
										DOWNLOAD
									</a>

									<div style={styles} onClick={() => window.history.back()}>
										BACK
									</div>
								</div>
							)}
						</div>
					);
				}
				if (error) {
					return <button>Receipt error</button>;
				}
				return null;
			}}
		</BlobProvider>
	);
};

const styles = {
	marginRight: "10px",
	display: "inline-block",
	padding: "5px 10px",
	color: "#63CB6C",
	cursor: "pointer",
	textDecoration: "none",
};

export default App;
