const express = require('Express');
const ExpressError = require('./ExpressError.js')

const app = express();

app.use(express.json());


app.get('/mean', function (req, res, next) {
    try {
        let nums = req.query.nums.split(",")
        let total = 0;
        for (num of nums) {
            total += +num;
        }
        let mean = total / nums.length;
        if (!mean) throw new ExpressError("Not valid numbers!", 400)
        return res.json({ resp: { operation: "mean", value: mean } })
    } catch (err) {
        return next(err)
    }
})

app.get('/median', function (req, res, next) {
    try {
        let nums = req.query.nums.split(",");
        let sortedNums = nums.sort((a, b) => a - b);
        let len = sortedNums.length;
        let median;
        if (len % 2 === 0) {
            median = (+sortedNums[len / 2] + +sortedNums[(len / 2) - 1]) / 2;
        } else {
            median = +sortedNums[Math.floor(len / 2)];
        }
        let allNums = nums.every(num => !isNaN(num))
        if (!allNums) throw new ExpressError("Not valid numbers!", 400)
        return res.json({ resp: { operation: "median", value: median } });
    } catch (err) {
        return next(err)
    }
})

app.get('/mode', function (req, res, next) {
    try {
        let nums = req.query.nums.split(",");
        let counter = {};
        for (let num of nums) {
            counter[num] ? counter[num]++ : counter[num] = 1
        }
        let most = -Infinity
        let mode = []
        for (let num in counter) {
            if (counter[num] > most) {
                most = counter[num]
            }
        }
        for (let num in counter) {
            if (counter[num] === most) {
                mode.push(+num)
            }
        }
        let allNums = nums.every(num => !isNaN(num))
        if (!allNums) throw new ExpressError("Not valid numbers!", 400)
        return res.json({ resp: { operation: "mode", value: mode } });
    } catch (err) {
        return next(err)
    }
})

app.use(function (err, req, res, next) {
    console.log("************", err)
    let status = err.status || 500;
    let message = err.message;

    return res.status(status).json({ error: { message, status } })
})




app.listen(5000, function () {
    console.log("app is running")
})