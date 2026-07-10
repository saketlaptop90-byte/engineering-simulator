import * as materials from '../utils/materials.js';

export function createSCADAHMIPanel(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Panel enclosure
    const panelGeo = new THREE.BoxGeometry(4, 3, 0.5);
    const panel = new THREE.Mesh(panelGeo, materials.steel);
    group.add(panel);

    // Screen
    const screenGeo = new THREE.BoxGeometry(3.6, 2.4, 0.1);
    const screen = new THREE.Mesh(screenGeo, new THREE.MeshStandardMaterial({
        color: 0x111111,
        emissive: 0x001122,
        roughness: 0.1,
        metalness: 0.8
    }));
    screen.position.z = 0.26;
    group.add(screen);

    // Flow Pipe UI Graphic (2D drawn on screen using 3D boxes)
    const uiGroup = new THREE.Group();
    uiGroup.position.z = 0.32;
    group.add(uiGroup);

    // Main Pipe on screen
    const uiPipeGeo = new THREE.PlaneGeometry(2, 0.2);
    const uiPipe = new THREE.Mesh(uiPipeGeo, new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.DoubleSide }));
    uiPipe.position.set(0, 0, 0);
    uiGroup.add(uiPipe);

    // Tank on screen
    const uiTankGeo = new THREE.PlaneGeometry(0.8, 1.2);
    const uiTank = new THREE.Mesh(uiTankGeo, new THREE.MeshBasicMaterial({ color: 0x555555, side: THREE.DoubleSide }));
    uiTank.position.set(1.2, 0.2, 0);
    uiGroup.add(uiTank);

    // Flow Indicator inside pipe
    const uiFlowGeo = new THREE.PlaneGeometry(0.5, 0.15);
    const uiFlow = new THREE.Mesh(uiFlowGeo, new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide }));
    uiFlow.position.set(-0.8, 0, 0.01);
    uiFlow.name = "FlowIndicator";
    uiGroup.add(uiFlow);

    // Tank Level inside tank
    const uiLevelGeo = new THREE.PlaneGeometry(0.7, 0.1); // Initial scale Y is small
    // Push geometry up so scaling Y grows upwards
    uiLevelGeo.translate(0, 0.05, 0);
    const uiLevel = new THREE.Mesh(uiLevelGeo, new THREE.MeshBasicMaterial({ color: 0x00aaff, side: THREE.DoubleSide }));
    uiLevel.position.set(1.2, -0.35, 0.01);
    uiLevel.name = "TankLevel";
    uiGroup.add(uiLevel);

    // Alarm text / box
    const uiAlarmGeo = new THREE.PlaneGeometry(0.6, 0.2);
    const uiAlarm = new THREE.Mesh(uiAlarmGeo, new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide }));
    uiAlarm.position.set(-1.2, 0.8, 0);
    uiAlarm.name = "AlarmIndicator";
    uiGroup.add(uiAlarm);

    // Animations
    const times = [0, 2, 4];
    
    // Flow indicator moving right
    const flowTrack = new THREE.VectorKeyframeTrack(
        `FlowIndicator.position`,
        [0, 1, 2, 3, 4],
        [-0.8, 0, 0.01, 0.2, 0, 0.01, 0.8, 0, 0.01, 0.2, 0, 0.01, -0.8, 0, 0.01]
    );

    // Tank level filling up and emptying
    const levelTrack = new THREE.VectorKeyframeTrack(
        `TankLevel.scale`,
        times,
        [1, 1, 1, 1, 10, 1, 1, 1, 1] // Grows 10x in Y
    );

    // Alarm blinking red to dark
    const alarmTrack = new THREE.VectorKeyframeTrack(
        `AlarmIndicator.scale`,
        [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4],
        [1,1,1, 0.01,0.01,0.01, 1,1,1, 0.01,0.01,0.01, 1,1,1, 0.01,0.01,0.01, 1,1,1, 0.01,0.01,0.01, 1,1,1]
    );

    const clip = new THREE.AnimationClip('SCADASimulation', 4, [flowTrack, levelTrack, alarmTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
