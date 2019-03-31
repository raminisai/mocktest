const tf = require("@tensorflow/tfjs");
const iris = require("./training.json");
// const irisTesting = require("./testing.json");

// Mapping the trainingdata
const trainingData = tf.tensor2d(
  iris.map(item => [item.vocabulary, item.technical, item.sentiment])
);

// Mapping the testing data
// const testingData = tf.tensor2d(
//   irisTesting.map(item => [item.vocabulary, item.technical, item.sentiment])
// );

// creating model
const outputData = tf.tensor2d(
  iris.map(item => [
    item.result === "0" ? 1 : 0,
    item.result === "1" ? 1 : 0,
    item.result === "2" ? 1 : 0,
    item.result === "3" ? 1 : 0
  ])
);

// Creating Model
const model = tf.sequential();

model.add(tf.layers.dense({ inputShape: 3, activation: "sigmoid", units: 5 }));

model.add(
  tf.layers.dense({
    inputShape: 5,
    units: 4,
    activation: "softmax"
  })
);

model.summary();

// compiling model
model.compile({
  loss: "categoricalCrossentropy",
  optimizer: tf.train.adam()
});

async function train_data() {
  console.log("......Loss History.......");
  for (let i = 0; i < 40; i++) {
    let res = await model.fit(trainingData, outputData, { epochs: 40 });
    console.log(`Iteration ${i}: ${res.history.loss[0]}`);
  }
}

export async function main(irisTesting) {
  await train_data();
  console.log("....Model Prediction .....");
  // model.predict(testingData).print();
  const testingData = tf.tensor2d(
    irisTesting.map(item => [item.vocabulary, item.technical, item.sentiment])
  );
  let predicted = model.predict(testingData);

  const logits = Array.from(predicted.dataSync());
  const winner = predicted.argMax(-1).dataSync()[0];

  let result = "";
  if (winner == 1) result = " selected for :microsoft";
  else if (winner == 0) result = "selected for : Amazon";
  else result = " selected for : TCS ";

  if (irisTesting[0].sentiment === -1)
    result = "Behaviour should be positive in order to enroll into company";
  else if (irisTesting[0].vocabulary < 0.4)
    result = "vocabulary skills are poor in order to enroll into company";
  else if (irisTesting[0].technical == -1)
    result = "Technical skills are poor in order to enroll into company";
  document.getElementById("modal-body").innerHTML = result;

  $("#my-modal").modal("show");
}

// main();
