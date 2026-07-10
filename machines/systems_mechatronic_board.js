import { getMaterials } from '../utils/materials.js';

export function createMechatronicBoard(THREE) {
    const group = new THREE.Group();
    const materials = getMaterials(THREE);
    const animationClips = [];

    // PCB Base
    const boardGeo = new THREE.BoxGeometry(4, 0.1, 4);
    const boardMat = materials.pcbGreen || new THREE.MeshStandardMaterial({ color: 0x005500 });
    const board = new THREE.Mesh(boardGeo, boardMat);
    group.add(board);

    // Microcontroller
    const mcuGeo = new THREE.BoxGeometry(1, 0.2, 1);
    const mcu = new THREE.Mesh(mcuGeo, materials.chipBlack || new THREE.MeshStandardMaterial({ color: 0x111111 }));
    mcu.position.set(0, 0.15, 0);
    group.add(mcu);

    // Relays / Components
    const compGeo = new THREE.BoxGeometry(0.4, 0.4, 0.6);
    for(let i=0; i<3; i++) {
        const comp = new THREE.Mesh(compGeo, materials.plasticBlue || new THREE.MeshStandardMaterial({ color: 0x000088 }));
        comp.position.set(-1.5, 0.25, -1 + i*1);
        group.add(comp);
    }

    // Moving Actuator on board
    const trackGeo = new THREE.BoxGeometry(0.1, 0.1, 3);
    const track = new THREE.Mesh(trackGeo, materials.metalBright || new THREE.MeshStandardMaterial({ color: 0xcccccc }));
    track.position.set(1.5, 0.1, 0);
    group.add(track);

    const sliderGeo = new THREE.BoxGeometry(0.3, 0.2, 0.4);
    const slider = new THREE.Mesh(sliderGeo, materials.highlightBright || new THREE.MeshStandardMaterial({ color: 0xffaa00 }));
    slider.position.set(1.5, 0.2, -1.5);
    group.add(slider);

    // LEDs
    const ledGeo = new THREE.SphereGeometry(0.1);
    const led1 = new THREE.Mesh(ledGeo, materials.indicatorRed || new THREE.MeshBasicMaterial({ color: 0x550000 }));
    led1.position.set(-1.5, 0.1, 1.5);
    group.add(led1);

    const led2 = new THREE.Mesh(ledGeo, materials.indicatorGreen || new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
    led2.position.set(-1.0, 0.1, 1.5);
    group.add(led2);

    // Animations: Slider moving, LEDs blinking
    const times = [0, 1, 2, 3, 4];
    
    // Slider movement
    const sliderPos = [
        1.5, 0.2, -1.5,
        1.5, 0.2, 1.5,
        1.5, 0.2, -1.5,
        1.5, 0.2, 1.5,
        1.5, 0.2, -1.5
    ];
    const trackSlider = new THREE.VectorKeyframeTrack(`${slider.uuid}.position`, times, sliderPos);

    const led1Scales = [1,1,1, 0.1,0.1,0.1, 1,1,1, 0.1,0.1,0.1, 1,1,1];
    const led2Scales = [0.1,0.1,0.1, 1,1,1, 0.1,0.1,0.1, 1,1,1, 0.1,0.1,0.1];
    
    const trackLed1 = new THREE.VectorKeyframeTrack(`${led1.uuid}.scale`, times, led1Scales);
    const trackLed2 = new THREE.VectorKeyframeTrack(`${led2.uuid}.scale`, times, led2Scales);

    const clip = new THREE.AnimationClip('Board_Op', 4, [trackSlider, trackLed1, trackLed2]);
    animationClips.push(clip);

    return { group, animationClips };
}
