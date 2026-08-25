import * as THREE from 'three';

export interface DotShape {
  positions: THREE.Vector3[];
  color: THREE.Color;
  type: 'bottle' | 'rabbit' | 'tree';
}

// Water Bottle - 물병 모양을 dot으로 만들기
export const createWaterBottleDots = (x: number, y: number, z: number): DotShape => {
  const positions: THREE.Vector3[] = [];
  const baseX = x;
  const baseY = y;
  const baseZ = z;

  // Bottle cap (원형)
  const capRadius = 2;
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    positions.push(
      new THREE.Vector3(
        baseX + Math.cos(angle) * capRadius,
        baseY + 4,
        baseZ + Math.sin(angle) * capRadius * 0.3
      )
    );
  }

  // Bottle neck (좁은 부분)
  for (let i = 0; i < 5; i++) {
    const height = 4 - i * 0.6;
    const radius = capRadius - i * 0.2;
    for (let j = 0; j < 6; j++) {
      const angle = (j / 6) * Math.PI * 2;
      positions.push(
        new THREE.Vector3(
          baseX + Math.cos(angle) * radius,
          baseY + height,
          baseZ + Math.sin(angle) * radius * 0.3
        )
      );
    }
  }

  // Bottle body (큰 부분)
  for (let i = 0; i < 8; i++) {
    const height = 1.5 - i * 0.3;
    const radius = 2.5 - i * 0.15;
    for (let j = 0; j < 10; j++) {
      const angle = (j / 10) * Math.PI * 2;
      positions.push(
        new THREE.Vector3(
          baseX + Math.cos(angle) * radius,
          baseY + height,
          baseZ + Math.sin(angle) * radius * 0.3
        )
      );
    }
  }

  return {
    positions,
    color: new THREE.Color(0xc5e8e8),
    type: 'bottle',
  };
};

// Rabbit - 토끼 모양을 dot으로 만들기
export const createRabbitDots = (x: number, y: number, z: number): DotShape => {
  const positions: THREE.Vector3[] = [];
  const baseX = x;
  const baseY = y;
  const baseZ = z;

  // Head (원형)
  const headRadius = 1.5;
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    for (let j = 0; j < 2; j++) {
      const r = headRadius - j * 0.5;
      positions.push(
        new THREE.Vector3(
          baseX + Math.cos(angle) * r,
          baseY + 2 + j * 0.3,
          baseZ + Math.sin(angle) * r * 0.3
        )
      );
    }
  }

  // Left Ear (세로 타원)
  for (let i = 0; i < 6; i++) {
    positions.push(
      new THREE.Vector3(baseX - 0.8, baseY + 3.5 - i * 0.3, baseZ + 0.3)
    );
    positions.push(
      new THREE.Vector3(baseX - 0.6, baseY + 3.5 - i * 0.3, baseZ + 0.2)
    );
  }

  // Right Ear (세로 타원)
  for (let i = 0; i < 6; i++) {
    positions.push(
      new THREE.Vector3(baseX + 0.8, baseY + 3.5 - i * 0.3, baseZ + 0.3)
    );
    positions.push(
      new THREE.Vector3(baseX + 0.6, baseY + 3.5 - i * 0.3, baseZ + 0.2)
    );
  }

  // Body (큰 원형)
  const bodyRadius = 1.2;
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    for (let j = 0; j < 3; j++) {
      const r = bodyRadius - j * 0.25;
      positions.push(
        new THREE.Vector3(
          baseX + Math.cos(angle) * r,
          baseY + 0.5 - j * 0.2,
          baseZ + Math.sin(angle) * r * 0.3
        )
      );
    }
  }

  // Eyes
  positions.push(new THREE.Vector3(baseX - 0.5, baseY + 2.2, baseZ + 0.5));
  positions.push(new THREE.Vector3(baseX + 0.5, baseY + 2.2, baseZ + 0.5));

  return {
    positions,
    color: new THREE.Color(0xf5e6d3),
    type: 'rabbit',
  };
};

// Tree - 나무 모양을 dot으로 만들기 (binary tree structure)
export const createTreeDots = (x: number, y: number, z: number): DotShape => {
  const positions: THREE.Vector3[] = [];
  const baseX = x;
  const baseY = y;
  const baseZ = z;

  // Trunk (수직 선)
  for (let i = 0; i < 6; i++) {
    positions.push(new THREE.Vector3(baseX, baseY - i * 0.4, baseZ));
    positions.push(new THREE.Vector3(baseX + 0.2, baseY - i * 0.4, baseZ));
    positions.push(new THREE.Vector3(baseX - 0.2, baseY - i * 0.4, baseZ));
  }

  // Crown (잎 부분 - binary tree 구조)
  // Level 0 (top)
  const crown = [
    { x: baseX, y: baseY + 2.5, radius: 0.5 },
    { x: baseX - 1.2, y: baseY + 1.5, radius: 0.6 },
    { x: baseX + 1.2, y: baseY + 1.5, radius: 0.6 },
    { x: baseX - 2.0, y: baseY + 0.5, radius: 0.5 },
    { x: baseX + 2.0, y: baseY + 0.5, radius: 0.5 },
    { x: baseX - 0.6, y: baseY + 0.3, radius: 0.4 },
    { x: baseX + 0.6, y: baseY + 0.3, radius: 0.4 },
  ];

  crown.forEach((level) => {
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      for (let j = 0; j < 2; j++) {
        const r = level.radius - j * 0.15;
        if (r > 0) {
          positions.push(
            new THREE.Vector3(
              level.x + Math.cos(angle) * r,
              level.y - j * 0.15,
              baseZ + Math.sin(angle) * r * 0.3
            )
          );
        }
      }
    }
  });

  return {
    positions,
    color: new THREE.Color(0xa8c5a6),
    type: 'tree',
  };
};

// Create Binary Tree structure of shapes
export const createBinaryTreeStructure = (): Array<{
  shape: DotShape;
  position: THREE.Vector3;
  depth: number;
}> => {
  const structures: Array<{
    shape: DotShape;
    position: THREE.Vector3;
    depth: number;
  }> = [];

  // Binary tree layout (depth-based)
  const maxDepth = 3;
  const spacing = 15;

  for (let depth = 0; depth < maxDepth; depth++) {
    const nodesAtDepth = Math.pow(2, depth);
    const depthY = 50 - depth * 20;

    for (let node = 0; node < nodesAtDepth; node++) {
      const depthX = ((node + 0.5) / nodesAtDepth - 0.5) * spacing * (maxDepth - depth);
      const depthZ = -depth * 30;

      const shapeType = node % 3;
      let shape: DotShape;

      if (shapeType === 0) {
        shape = createWaterBottleDots(depthX, depthY, depthZ);
      } else if (shapeType === 1) {
        shape = createRabbitDots(depthX, depthY, depthZ);
      } else {
        shape = createTreeDots(depthX, depthY, depthZ);
      }

      structures.push({
        shape,
        position: new THREE.Vector3(depthX, depthY, depthZ),
        depth,
      });
    }
  }

  return structures;
};
