/* eslint-disable no-unused-vars */
import * as tf from "@tensorflow/tfjs";
import React, { useContext, useRef, useState } from "react";
import ImageContext from "../contexts/image-context";

import "./form.css";

export default function TensorFlowModel() {
    const [uploadedImage, setuploadedImage] = useState({
        preview: "",
        raw: "",
    });
    const [model, setModel] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imagePrediction, setimagePrediction] = useState(null);

    const imageRef = useRef();
    const ImagePreProcessing = async (image) => {
        const meanImagenet = tf.tensor1d([123.68, 116.779, 103.939]);
        const tensor = await tf.browser
            .fromPixels(image)
            .resizeNearestNeighbor([224, 224])
            .toFloat()
            .sub(meanImagenet)
            .reverse(2)
            .expandDims();
        return tensor;
    };
    console.log(imageRef.current);
    const getPredictionFromImage = async () => {
        if (model) {
            setLoading(true);
            try {
                const testImage = imageRef.current;
                const tensor = await ImagePreProcessing(testImage);
                const predictions = await model.predict(tensor).data();
                console.log("prediction successed");
                const finalOutput = Array.from(predictions)
                    .map((p, i) => {
                        return { probablity: p, classname: ImageClasses[i] };
                    })
                    .sort((a, b) => b.probablity - a.probablity)
                    .slice(0, 5);
                setLoading(false);
                setimagePrediction(finalOutput);
                console.log(finalOutput);
            } catch (err) {
                // console.log(err);
                alert("No Image Selected");
            }
        } else {
            setError("Please load a model.");
            alert("Please load a model.");
        }
    };

    const loadModelFunction = async (image) => {
        try {
            const fetchdModel = await tf.loadLayersModel(
                "http://localhost:4000/models/vgg16/model.json"
            );
            setModel(fetchdModel);
            setError(null);
            alert("Model Loaded");
        } catch (err) {
            console.log(err);
        }
    };

    const handleImageChange = (e) => {
        try {
            setuploadedImage({
                preview: URL.createObjectURL(e.target.files[0]),
                raw: e.target.files[0],
            });
            console.log({
                preview: URL.createObjectURL(e.target.files[0]),
                raw: e.target.files[0],
            });
        } catch (er) {
            alert("Image not selected");
            console.log(er);
        }
    };

    const imageCtx = useContext(ImageContext);
    const { imageNetClasses: ImageClasses } = imageCtx;

    const renderList = imagePrediction ? (
        <ul className="list-group">
            {imagePrediction.map((item) => (
                <li className="list-group-item" key={item.probablity}>
                    <span style={{ fontWeight: "bold" }} className="prediction">
                        Class Name:
                    </span>
                    <span
                        style={{
                            textTransform: "capitalize",
                            padding: "0 0.5rem",
                        }}
                        className="result"
                    >
                        {" "}
                        {item.classname}
                    </span>
                    <span
                        style={{ fontWeight: "bold", paddingRight: "0.5rem" }}
                        className="predicton"
                    >
                        Probablity:
                    </span>
                    {`${item.probablity.toFixed(2) * 100}%`}
                </li>
            ))}
        </ul>
    ) : null;

    return (
        <form>
            <div className="form-group form-acrtion">
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={loadModelFunction}
                    disabled={model}
                >
                    {model ? "Model Loaded" : "Load Model"}
                </button>
                {error && <p>{error}</p>}
            </div>
            {uploadedImage.preview ? (
                <div className="image-file">
                    <img
                        ref={imageRef}
                        src={uploadedImage.preview}
                        alt="uploadedimage"
                    />
                </div>
            ) : (
                ""
            )}
            <div className="form-group">
                <label className="form-label" htmlFor="fileupload">
                    Choose file
                </label>
                <input
                    onChange={handleImageChange}
                    className="form-control"
                    id="fileupload"
                    type="file"
                />
            </div>

            {uploadedImage.preview !== "" ? (
                <div className="form-group  form-acrtion">
                    <button
                        type="button"
                        className="btn btn-dark"
                        onClick={getPredictionFromImage}
                    >
                        Predict
                    </button>
                </div>
            ) : (
                ""
            )}
            {loading && uploadedImage.preview !== "" && !imagePrediction ? (
                <h4>Loading</h4>
            ) : (
                renderList
            )}
        </form>
    );
}
