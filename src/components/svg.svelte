<script lang="ts">
    import { SvgAnimator } from "$lib/animator/svg";
    import { SVG } from "@svgdotjs/svg.js";
    import animationsStore from "../store/animations";
    import type { Animations } from "$lib/models/cursor-theme";
    import { onMount } from "svelte";

    let animations: Animations = [];

    
    let element: SVGSVGElement;
    $: {
        if (element) {
            animate();
        }
    }

    let animator: SvgAnimator;

    onMount(() => {
        animator = new SvgAnimator(SVG(element), animations);
        //animator.loop();
    });

    function animate() {
        if (!animator) return;
        animator.applyAnimations(animations);
        animator.loop();
    
    }

    animationsStore.subscribe((value) => {
        animations = value;
        animate();
    });

    async function handleDrop(event: DragEvent) {
        event.preventDefault();
        const file = event.dataTransfer?.files[0];
        if (file) {
            const text = await file.text();
            const parser = new DOMParser();
            const svg = parser
                .parseFromString(text, "image/svg+xml")
                .querySelector("svg");
            if (svg) {
                element.setAttribute("viewBox", svg.getAttribute("viewBox")!);
                element.innerHTML = svg.innerHTML;
            }
        }
    }
</script>

<div role="img" on:drop={handleDrop} on:dragover|preventDefault>
    <svg bind:this={element} viewBox="0 0 32 32" fill="none">
        <g
            id="cursor=progress, variant=default, size=32"
            clip-path="url(#clip0_3701_773)"
        >
            <g id="cursor">
                <g id="pointer">
                    <mask
                        id="path-1-outside-1_3701_773"
                        maskUnits="userSpaceOnUse"
                        x="1.19995"
                        y="1.5"
                        width="14"
                        height="23"
                        fill="black"
                    >
                        <rect
                            fill="white"
                            x="1.19995"
                            y="1.5"
                            width="14"
                            height="23"
                        />
                        <path
                            d="M14.2 14.8782L3 2.5L2.99995 19.2437L6.99993 18.736L10.5 23L11.5 22.5L10.9999 17.2132L14.2 14.8782Z"
                        />
                    </mask>
                    <path
                        d="M14.2 14.8782L3 2.5L2.99995 19.2437L6.99993 18.736L10.5 23L11.5 22.5L10.9999 17.2132L14.2 14.8782Z"
                        fill="#121212"
                    />
                    <path
                        d="M14.2 14.8782L3 2.5L2.99995 19.2437L6.99993 18.736L10.5 23L11.5 22.5L10.9999 17.2132L14.2 14.8782Z"
                        stroke="white"
                        stroke-opacity="0.5"
                        stroke-width="2"
                        stroke-linejoin="round"
                        mask="url(#path-1-outside-1_3701_773)"
                    />
                </g>
            </g>
            <g id="spinner">
                <g id="segments">
                    <path
                        id="red"
                        d="M20.8675 15.181C21.1586 15.116 21.4536 15.0682 21.7511 15.0382C21.9973 15.0137 22.247 15.0013 22.4997 15.0013C23.1711 15.0013 23.8219 15.0895 24.4411 15.255C25.0602 15.4213 25.6679 15.6703 26.2494 16.006C26.4682 16.1323 26.6783 16.268 26.8794 16.4123C27.2943 16.7113 27.6773 17.0516 28.0226 17.4273C27.748 20.2506 25.3859 22.4626 22.4994 22.5001C23.9098 19.9816 23.1751 16.8304 20.8675 15.181Z"
                        fill="#DA5858"
                    />
                    <path
                        id="orange"
                        d="M28.0222 17.4267C28.2241 17.6463 28.413 17.878 28.5877 18.1205C28.732 18.3215 28.8677 18.5316 28.994 18.7504C29.3297 19.3318 29.5787 19.9396 29.745 20.5586C29.9105 21.1778 29.9987 21.8287 29.9987 22.5001C29.9987 22.7528 29.9862 23.0026 29.9618 23.2489C29.9104 23.7576 29.8072 24.2595 29.6545 24.7464C27.0721 25.9202 23.9754 24.9806 22.4996 22.4996C25.3859 22.4617 27.7477 20.2499 28.0222 17.4267Z"
                        fill="#FFA200"
                    />
                    <path
                        id="yellow"
                        d="M29.6548 24.7458C29.5655 25.0304 29.4593 25.3098 29.3367 25.5824C29.2347 25.8079 29.1207 26.0304 28.9943 26.2492C28.6586 26.8307 28.2568 27.3502 27.8039 27.8037C27.3504 28.2566 26.8308 28.6585 26.2494 28.9942C26.0305 29.1205 25.8079 29.2346 25.5825 29.3366C25.1161 29.5464 24.6298 29.708 24.1319 29.8192C21.8241 28.1697 21.0895 25.0181 22.5002 22.4995C23.9762 24.9802 27.0726 25.9196 29.6548 24.7458Z"
                        fill="#F4E434"
                    />
                    <path
                        id="green"
                        d="M24.1326 29.8192C23.8415 29.8842 23.5464 29.9319 23.249 29.962C23.0027 29.9864 22.753 29.9989 22.5003 29.9989C21.8289 29.9989 21.1781 29.9107 20.5589 29.7452C19.9399 29.5789 19.3321 29.3299 18.7506 28.9942C18.5318 28.8678 18.3217 28.7321 18.1206 28.5878C17.7058 28.2889 17.3227 27.9486 16.9775 27.5729C17.2521 24.7496 19.6141 22.5376 22.5006 22.5C21.0903 25.0185 21.8249 28.1698 24.1326 29.8192Z"
                        fill="#3FC661"
                    />
                    <path
                        id="blue"
                        d="M16.9777 27.5735C16.7759 27.3539 16.587 27.1222 16.4122 26.8797C16.268 26.6786 16.1323 26.4686 16.006 26.2498C15.6703 25.6683 15.4213 25.0606 15.255 24.4416C15.0895 23.8223 15.0012 23.1715 15.0012 22.5001C15.0012 22.2474 15.0137 21.9976 15.0381 21.7513C15.0896 21.2426 15.1928 20.7406 15.3455 20.2538C17.9279 19.0799 21.0245 20.0196 22.5003 22.5006C19.6141 22.5384 17.2523 24.7503 16.9777 27.5735Z"
                        fill="#497EE9"
                    />
                    <path
                        id="purple"
                        d="M15.3452 20.2544C15.4344 19.9698 15.5406 19.6904 15.6633 19.4177C15.7653 19.1923 15.8793 18.9698 16.0056 18.7509C16.3413 18.1695 16.7431 17.65 17.1961 17.1965C17.6496 16.7435 18.1691 16.3417 18.7506 16.006C18.9695 15.8796 19.192 15.7656 19.4175 15.6636C19.8839 15.4538 20.3701 15.2922 20.8681 15.181C23.1759 16.8305 23.9105 19.9821 22.4997 22.5006C21.0238 20.02 17.9274 19.0806 15.3452 20.2544Z"
                        fill="#7154F2"
                    />
                </g>
            </g>
        </g>
        <defs>
            <clipPath id="clip0_3701_773">
                <rect width="32" height="32" fill="white" />
            </clipPath>
        </defs>
    </svg>
</div>


<style>
    div[role="img"] {
        background: rgb(50, 50, 50);
        background: repeating-conic-gradient(
                rgba(0, 0, 0, 0.8) 0% 25%,
                rgba(0, 0, 0, 0.6) 0% 50%
            )
            0% / 40px 40px;
        border: none;
    }
    svg {
        width: 100%;
        height: 100%;
    }
</style>