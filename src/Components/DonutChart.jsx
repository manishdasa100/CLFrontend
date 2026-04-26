import { ResponsivePie } from '@nivo/pie';
import { mockChartData } from './chartdata';

export default function DonutChart({height, width, colorScheme, data}) {

    return (
        <div className={`${height} flex justify-between items-center`}>
            <div className={`h-full ${width}`}>
                <ResponsivePie
                    data={mockChartData}
                    startAngle={360}
                    endAngle={-8}
                    sortByValue={true}
                    innerRadius={0.7}
                    padAngle={3}
                    cornerRadius={11}
                    activeOuterRadiusOffset={8}
                    colors={["#E8B500", "#00E89B", "#FF3D3D", "#282828"]}
                    borderColor={{
                        from: 'color',
                        modifiers: [
                            [
                                'darker',
                                0.2
                            ]
                        ]
                    }}
                    enableArcLinkLabels={false}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="#333333"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: 'color' }}
                    enableArcLabels={false}
                    arcLabel="id"
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{
                        from: 'color',
                        modifiers: [
                            [
                                'darker',
                                2
                            ]
                        ]
                    }}
                    isInteractive={false}
                    defs={[
                        {
                            id: 'dots',
                            type: 'patternDots',
                            background: 'inherit',
                            color: 'rgba(255, 255, 255, 0.3)',
                            size: 4,
                            padding: 1,
                            stagger: true
                        },
                        {
                            id: 'lines',
                            type: 'patternLines',
                            background: 'inherit',
                            color: 'rgba(255, 255, 255, 0.3)',
                            rotation: -45,
                            lineWidth: 6,
                            spacing: 10
                        }
                    ]}
                    fill={[]}
                    legends={[]}
                />
            </div>
            <div className='mr-3 flex-1 relative text-xs text-[#36466A] font-semibold'>
                <p className="before:inline-block before:mr-1 before:w-2 before:h-2 before:bg-[#00E89B] before:rounded-full">Easy</p>
                <p className='ml-1 before:inline-block before:mr-1 before:w-2 before:h-2 before:bg-[#E8B500] before:rounded-full mt-1'>Medium</p>
                <p className='before:inline-block before:mr-1 before:w-2 before:h-2 before:bg-[#FF3D3D] before:rounded-full mt-1'>Hard</p>
            </div>
        </div>
    )
}