import React from "react";
import { Document, Page, Text, Image, View } from "@react-pdf/renderer";
import TableRow from "./component/TableRow";

const PaymentReceipt = ({ payment }) => {
	const isPAYE = payment.tax_item_id === "13" && payment.mda_id === "3";
	let payeDisplay = {};
	if (isPAYE) {
		payeDisplay = JSON.parse(payment.rules);
	}

	return (
		<Document>
			<Page style={styles.body}>
				<View>
					<Image
						alt=""
						src="logo.png"
						style={{ width: "50px", height: "auto" }}
					/>
					<Text>Smart Tax</Text>
				</View>
				<View class="separator-breadcrumb border-top"></View>
				<Text style={{ textAlign: "right" }}>
					Bill Reference: {payment.billing_ref}
				</Text>

				<View>
					<Text style={{ display: "block" }}>Plateau State Internal</Text>
					<Text style={{ display: "block" }}>Revenue Service</Text>
					<Text style={{ display: "block" }}>Bank Road, Jos</Text>
					<View
						style={{
							display: "inline-block",
							width: "140px",
							border: "0.1px solid #000",
						}}
					></View>
				</View>

				<View>
					<Image
						alt=""
						src="logo-.png"
						style={{ width: "200px", height: "auto", margin: "auto" }}
					/>
				</View>
				<Text
					style={{
						color: "green",
						fontSize: "33px",
						fontWeight: "bold",
						textAlign: "center",
					}}
				>
					PLATEAU STATE GOVERNMENT
				</Text>
				<View style={{ textAlign: "center" }}>
					<Text
						style={{
							fontWeight: "bold",
							padding: "15px",
							backgroundColor: "green",
							display: "inline-block",
							fontSize: "20px",
						}}
					>
						TAX ASSESSMENT ({isPAYE && "PAYE"})
					</Text>
				</View>
				<View>
					<View style={styles.tableContainer}>
						<TableRow
							data={{
								key: "MDA",
								value: payment.mda,
							}}
						/>
						<TableRow
							data={{
								key: "Tax Item",
								value: payment.tax_item,
							}}
						/>
						<TableRow
							data={{
								key: "Payment Channel",
								value: payment.payment_channel || "Not Available",
							}}
						/>
						<TableRow
							data={{
								key: "Period",
								value: payment.period_from
									? `${payment.period_from} ${payment.period_to}`
									: "Not Available",
							}}
						/>

						<TableRow
							data={{
								key: "Payer Name",
								value: payment.payer_name || payment.name,
							}}
						/>
						<TableRow
							data={{
								key: "TIN",
								value: payment.tin || payment.stin || payment.pltin,
							}}
						/>
						<TableRow
							data={{
								key: "Billing Ref",
								value: payment.billing_ref,
							}}
						/>
						{isPAYE && (
							<>
								<TableRow
									data={{
										key: "Developemnt Levy",
										value: new Intl.NumberFormat(true ? "ng-NG" : "en-NG", {
											style: "currency",
											currency: "NGN",
										}).format(payeDisplay.dev_levy),
									}}
								/>
								<TableRow
									data={{
										key: "Taxable Payable",
										value: new Intl.NumberFormat(true ? "ng-NG" : "en-NG", {
											style: "currency",
											currency: "NGN",
										}).format(payeDisplay.tax),
									}}
								/>
								<TableRow
									data={{
										key: "Grand Total",
										value: new Intl.NumberFormat(true ? "ng-NG" : "en-NG", {
											style: "currency",
											currency: "NGN",
										}).format(payeDisplay.dev_levy + payeDisplay.tax),
									}}
								/>
							</>
						)}
						{!isPAYE && (
							<TableRow
								data={{
									key: "Amount",
									value: new Intl.NumberFormat(true ? "ng-NG" : "en-NG", {
										style: "currency",
										currency: "NGN",
									}).format(payment.amount),
								}}
							/>
						)}
						<TableRow
							data={{
								key: "Created by",
								value: payment.created_by || "Nil",
							}}
						/>
					</View>
				</View>

				<Page style={styles.body}>
					<Text
						style={styles.pageNumber}
						render={({ pageNumber, totalPages }) =>
							`${pageNumber} / ${totalPages}`
						}
						fixed
					/>
				</Page>
			</Page>
		</Document>
	);
};

const styles = {
	body: {
		paddingTop: 35,
		paddingBottom: 65,
		paddingHorizontal: 35,
	},
	tableContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		padding: "20px 10px",
	},
	title: {
		fontSize: 24,
		textAlign: "center",
	},
	author: {
		fontSize: 12,
		textAlign: "center",
		marginBottom: 40,
	},
	subtitle: {
		fontSize: 18,
		margin: 12,
	},
	text: {
		margin: 12,
		fontSize: 14,
		textAlign: "justify",
		fontFamily: "Times-Roman",
	},
	image: {
		marginVertical: 15,
		marginHorizontal: 100,
	},

	pageNumber: {
		position: "absolute",
		fontSize: 12,
		bottom: 30,
		left: 0,
		right: 0,
		textAlign: "center",
		color: "grey",
	},
};

export default PaymentReceipt;
