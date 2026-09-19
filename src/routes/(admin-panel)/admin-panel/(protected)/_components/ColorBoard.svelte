<script lang="ts">
    interface Props {
        value?: string;
        onchange?: (color: string) => void;
    }

    let { value = $bindable("#65D3B3"), onchange }: Props = $props();

    const HEX_PATTERN = /^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    const parseHex = (input: string): string | null => {
        let clean = input.trim();
        if (!clean) return null;
        if (clean.charAt(0) === "#") clean = clean.slice(1);
        if (!HEX_PATTERN.test(clean)) return null;
        if (clean.length === 3) {
            clean = clean
                .split("")
                .map((c) => c + c)
                .join("");
        }
        return `#${clean.toUpperCase()}`;
    };

    const hexToRgb = (hex: string): [number, number, number] => {
        const clean = hex.charAt(0) === "#" ? hex.slice(1) : hex;
        return [
            parseInt(clean.slice(0, 2), 16),
            parseInt(clean.slice(2, 4), 16),
            parseInt(clean.slice(4, 6), 16)
        ];
    };

    const rgbToHsv = (r: number, g: number, b: number): [number, number, number] => {
        r /= 255;
        g /= 255;
        b /= 255;
        const min = Math.min(r, g, b);
        const max = Math.max(r, g, b);
        const delta = max - min;
        let h = 0;
        if (delta !== 0) {
            if (max === r) h = (60 * ((g - b) / delta)) % 360;
            else if (max === g) h = 60 * ((b - r) / delta) + 120;
            else h = 60 * ((r - g) / delta) + 240;
        }
        if (h < 0) h += 360;
        const s = max === 0 ? 0 : delta / max;
        return [h, s, max];
    };

    const hsvToRgb = (h: number, s: number, v: number): [number, number, number] => {
        const hi = Math.floor(h / 60) % 6;
        const f = h / 60 - Math.floor(h / 60);
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
        let r: number, g: number, b: number;
        switch (hi) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            default:
                r = v;
                g = p;
                b = q;
                break;
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    };

    const toHex2 = (n: number) =>
        Math.max(0, Math.min(255, Math.round(n)))
            .toString(16)
            .padStart(2, "0");

    const hsvToHex = (h: number, s: number, v: number): string =>
        `#${hsvToRgb(h, s, v).map(toHex2).join("")}`.toUpperCase();

    let block: HTMLDivElement | undefined = $state();
    let colorLine: HTMLDivElement | undefined = $state();

    let hue = $state(0);
    let saturation = $state(1);
    let brightness = $state(1);
    let blockTop = $state(0);
    let blockLeft = $state(0);
    let lineLeft = $state(0);
    let inputValue = $state(value);

    const currentColor = $derived(hsvToHex(hue, saturation, brightness));
    const hueColor = $derived(hsvToHex(hue, 1, 1));

    const setSlidersPosition = () => {
        if (!block || !colorLine) return;
        const [h, s, v] = rgbToHsv(...hexToRgb(parseHex(value) ?? "#65D3B3"));
        hue = h;
        saturation = s;
        brightness = v;
        const { width, height } = block.getBoundingClientRect();
        blockLeft = s * width;
        blockTop = Math.abs(height * (v - 1));
        lineLeft = (h * colorLine.getBoundingClientRect().width) / 359;
    };

    $effect(() => {
        requestAnimationFrame(setSlidersPosition);
    });

    const commitColor = () => {
        value = currentColor;
        inputValue = currentColor;
        onchange?.(value);
    };

    const moveBlockSlider = (x: number, y: number) => {
        if (!block) return;
        const { width, height } = block.getBoundingClientRect();
        blockLeft = Math.min(Math.max(x, 0), width);
        blockTop = Math.min(Math.max(y, 0), height);
        saturation = blockLeft / width;
        brightness = Math.abs(blockTop / height - 1);
        commitColor();
    };

    const moveLineSlider = (x: number) => {
        if (!colorLine) return;
        const width = colorLine.getBoundingClientRect().width;
        lineLeft = Math.min(Math.max(x, 0), width);
        hue = Math.max(Math.min(Math.round((lineLeft * 359) / width), 359), 0);
        commitColor();
    };

    const dragBlock = (event: PointerEvent) => {
        event.preventDefault();
        const rect = block!.getBoundingClientRect();
        const update = (e: PointerEvent) =>
            moveBlockSlider(e.clientX - rect.left, e.clientY - rect.top);
        update(event);
        const onMove = (e: PointerEvent) => update(e);
        const onUp = () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
        };
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
    };

    const dragLine = (event: PointerEvent) => {
        event.preventDefault();
        const rect = colorLine!.getBoundingClientRect();
        const update = (e: PointerEvent) => moveLineSlider(e.clientX - rect.left);
        update(event);
        const onMove = (e: PointerEvent) => update(e);
        const onUp = () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
        };
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
    };

    const blockKeydown = (event: KeyboardEvent) => {
        let x = blockLeft;
        let y = blockTop;
        if (event.key === "ArrowLeft") x -= 1;
        else if (event.key === "ArrowRight") x += 1;
        else if (event.key === "ArrowUp") y -= 1;
        else if (event.key === "ArrowDown") y += 1;
        else return;
        event.preventDefault();
        moveBlockSlider(x, y);
    };

    const lineKeydown = (event: KeyboardEvent) => {
        let x = lineLeft;
        if (event.key === "ArrowLeft" || event.key === "ArrowDown") x -= 1;
        else if (event.key === "ArrowRight" || event.key === "ArrowUp") x += 1;
        else return;
        event.preventDefault();
        moveLineSlider(x);
    };

    const handleInput = (event: Event) => {
        const target = event.target as HTMLInputElement;
        inputValue = target.value;
        const parsed = parseHex(target.value);
        if (parsed) {
            value = parsed;
            onchange?.(value);
            setSlidersPosition();
        }
    };
</script>

<div class="flex w-full flex-col gap-3">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        bind:this={block}
        class="-[0_1px_3px_rgba(0,0,0,0.2)] relative h-35 w-full"
        style={`background-color: ${hueColor}; background-image: linear-gradient(0deg, #000, hsla(0, 0%, 100%, 0)), linear-gradient(90deg, #fff, hsla(20, 42%, 65%, 0));`}
        onpointerdown={dragBlock}
    >
        <div
            role="slider"
            tabindex="0"
            aria-label="Saturation and brightness"
            aria-valuenow={Math.round(saturation * 100)}
            class="-[0_1px_3px_rgba(0,0,0,0.2)] absolute -mt-2 -ml-2 h-4 w-4 rounded-full border-2 border-white focus:outline-none"
            style={`background-color: ${currentColor}; top: ${blockTop}px; left: ${blockLeft}px;`}
            onkeydown={blockKeydown}
        ></div>
    </div>

    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        bind:this={colorLine}
        class="relative h-2 w-full rounded-md"
        style="background-image: linear-gradient(90deg, red, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, red);"
        onpointerdown={dragLine}
    >
        <div
            role="slider"
            tabindex="0"
            aria-label="Hue"
            aria-valuenow={hue}
            aria-valuemin={0}
            aria-valuemax={359}
            class="-[0_1px_3px_rgba(0,0,0,0.2)] absolute -top-1 -ml-1.75 h-3.5 w-3.5 rounded-full border-2 border-white focus:outline-none"
            style={`background-color: ${hueColor}; left: ${lineLeft}px;`}
            onkeydown={lineKeydown}
        ></div>
    </div>

    <div class="flex items-center justify-between gap-2">
        <div
            class="h-8 w-[calc(50%-4px)] rounded"
            style={`background-color: ${currentColor}`}
        ></div>
        <input
            type="text"
            class="w-[calc(50%-4px)] rounded border border-gray-300 px-2 py-1.5 text-sm text-gray-700 outline-none focus:border-theme-500"
            value={inputValue}
            oninput={handleInput}
        />
    </div>
</div>
