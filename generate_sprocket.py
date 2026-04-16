#!/usr/bin/env python3
"""Generate 16 Sprocket buddy variations on ComfyUI."""
import json, urllib.request, urllib.parse, time, random, os

COMFY = "http://192.168.100.2:8188"

def queue(workflow):
    data = json.dumps({"prompt": workflow}).encode()
    req = urllib.request.Request(f"{COMFY}/prompt", data=data, headers={"Content-Type": "application/json"})
    resp = urllib.request.urlopen(req)
    return json.loads(resp.read())["prompt_id"]

def make_workflow(ckpt, prompt, negative, steps, cfg, width=1024, height=1024, seed=None, batch=1):
    if seed is None:
        seed = random.randint(1, 2**31)
    return {
        "1": {"class_type": "CheckpointLoaderSimple", "inputs": {"ckpt_name": ckpt}},
        "2": {"class_type": "CLIPTextEncode", "inputs": {"text": prompt, "clip": ["1", 1]}},
        "3": {"class_type": "CLIPTextEncode", "inputs": {"text": negative, "clip": ["1", 1]}},
        "4": {"class_type": "EmptyLatentImage", "inputs": {"width": width, "height": height, "batch_size": batch}},
        "5": {"class_type": "KSampler", "inputs": {
            "model": ["1", 0], "positive": ["2", 0], "negative": ["3", 0], "latent_image": ["4", 0],
            "seed": seed, "steps": steps, "cfg": cfg, "sampler_name": "euler", "scheduler": "normal", "denoise": 1.0
        }},
        "6": {"class_type": "VAEDecode", "inputs": {"samples": ["5", 0], "vae": ["1", 2]}},
        "7": {"class_type": "SaveImage", "inputs": {"images": ["6", 0], "filename_prefix": "Sprocket"}}
    }

# Core identity for all prompts
base = "epic intelligent snail creature, detailed shell, expressive eyes, creature concept art"
neg = "text, watermark, signature, blurry, low quality, deformed, ugly, human"

# 16 variations across different models and styles
jobs = [
    # RealVisXL - Photorealistic (4)
    ("RealVisXL_V5.0_fp16.safetensors", f"iron-armored deep sea snail with metallic black scales on its foot, hydrothermal vent creature, bioluminescent pink flesh, dark background, {base}, photorealistic, macro photography", neg, 25, 7.0),
    ("RealVisXL_V5.0_fp16.safetensors", f"cosmic alien snail with a translucent galaxy-filled shell, nebula patterns, glowing blue and purple, floating in space, stars visible through shell, {base}, photorealistic, cinematic lighting", neg, 25, 7.0),
    ("RealVisXL_V5.0_fp16.safetensors", f"multi-eyed alien snail creature, bioluminescent teal skin with spotted texture, multiple eye stalks, golden third eye on forehead, wise ancient expression, {base}, photorealistic, studio lighting", neg, 25, 7.0),
    ("RealVisXL_V5.0_fp16.safetensors", f"biomechanical cybernetic snail, chrome and organic fusion, circuit patterns glowing on shell, cyberpunk neon lights, rain-slicked surface, {base}, photorealistic, dark sci-fi", neg, 25, 7.0),

    # ZavyChromaXL - Stylized (4)
    ("zavychromaxl_v80.safetensors", f"crystal ice snail sage, frozen crystalline shell with prismatic reflections, wise glowing eyes, sitting on ancient tome, magical frost particles, {base}, fantasy art, detailed illustration", neg, 25, 7.0),
    ("zavychromaxl_v80.safetensors", f"steampunk clockwork snail, brass and copper shell with gears and pistons, monocle, top hat, steam venting, Victorian era, {base}, detailed illustration, warm lighting", neg, 25, 7.0),
    ("zavychromaxl_v80.safetensors", f"magma volcanic snail, obsidian shell with glowing lava cracks, ember eyes, molten trail, volcanic landscape background, {base}, dramatic lighting, fantasy art", neg, 25, 7.0),
    ("zavychromaxl_v80.safetensors", f"ethereal ghost snail, translucent spectral body, glowing from within, wispy tendrils, haunted forest, moonlight, {base}, dark fantasy, mystical atmosphere", neg, 25, 7.0),

    # NovaAnimeXL - Anime (4)
    ("novaAnimeXL_ilV125.safetensors", f"cute cosmic snail with fluffy white fur body, big sparkling eyes, blue galaxy shell with stars, small wings, kawaii, {base}, anime style, cel shading", neg, 25, 7.0),
    ("novaAnimeXL_ilV125.safetensors", f"dragon snail hybrid, tiny wings on shell, scales and horns, breathing small flame, fierce but adorable expression, {base}, anime style, fantasy", neg, 25, 7.0),
    ("novaAnimeXL_ilV125.safetensors", f"forest spirit snail with moss and tiny mushrooms growing on shell, leaf patterns, woodland setting, fairy lights, {base}, anime style, ghibli inspired, whimsical", neg, 25, 7.0),
    ("novaAnimeXL_ilV125.safetensors", f"void snail, dark matter body, shell made of compressed starfield, constellation patterns, floating in abstract space, {base}, anime style, cosmic horror cute", neg, 25, 7.0),

    # Image Turbo - Fast variations (4)
    ("z_image_turbo_fp8_e4m3fn.safetensors", f"jellyfish snail hybrid, bioluminescent tentacles trailing from shell, deep ocean, neon pink and blue glow, {base}, digital art", neg, 9, 2.0),
    ("z_image_turbo_fp8_e4m3fn.safetensors", f"ancient stone golem snail, shell covered in runes and moss, glowing ancient symbols, temple ruins background, {base}, digital art", neg, 9, 2.0),
    ("z_image_turbo_fp8_e4m3fn.safetensors", f"nebula snail, entire body is made of colorful gas clouds, eye stalks are lightning bolts, cosmic dust trail, {base}, digital art, vibrant colors", neg, 9, 2.0),
    ("z_image_turbo_fp8_e4m3fn.safetensors", f"armored warrior snail, samurai shell with battle scars, katana strapped to side, cherry blossoms falling, {base}, digital art, japanese style", neg, 9, 2.0),
]

print(f"Queuing {len(jobs)} Sprocket variations to ComfyUI...")
prompt_ids = []
for i, (ckpt, prompt, negative, steps, cfg) in enumerate(jobs):
    model_name = ckpt.split("_")[0].split(".")[0]
    pid = queue(make_workflow(ckpt, prompt, negative, steps, cfg))
    prompt_ids.append(pid)
    print(f"  [{i+1:2d}/16] Queued: {model_name} - {prompt[:60]}...")

print(f"\nAll 16 queued! Waiting for completion...")

# Poll for completion
completed = set()
while len(completed) < len(prompt_ids):
    time.sleep(3)
    try:
        resp = urllib.request.urlopen(f"{COMFY}/history")
        history = json.loads(resp.read())
        for pid in prompt_ids:
            if pid in history and pid not in completed:
                completed.add(pid)
                print(f"  Completed {len(completed)}/16")
    except:
        pass

print("\nAll 16 images generated!")
print("Fetching output filenames...")

# Get output filenames
filenames = []
resp = urllib.request.urlopen(f"{COMFY}/history")
history = json.loads(resp.read())
for pid in prompt_ids:
    if pid in history:
        outputs = history[pid].get("outputs", {})
        for node_id, node_out in outputs.items():
            if "images" in node_out:
                for img in node_out["images"]:
                    filenames.append(img["filename"])

print(f"Generated files: {json.dumps(filenames, indent=2)}")
