import json

json.dumps({
    "one": float(time_one),
    "two": float(time_two),
    "sizeOne": int(H_one.shape[0]),
    "sizeTwo": int(H_two.shape[0]),
}, allow_nan=False)
