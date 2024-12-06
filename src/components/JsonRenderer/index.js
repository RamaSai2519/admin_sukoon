import React from 'react'

const PropertyValueRenderer = ({ data }) => {
    const renderValue = (value) => {
        if (value === null) return <span className="text-gray-500">Not specified</span>
        if (typeof value === 'boolean') return value ? 'Yes' : 'No'
        if (typeof value === 'object') {
            if (Array.isArray(value)) {
                return value.join(', ')
            }
            return <PropertyValueRenderer data={value} />
        }
        return String(value)
    }

    return (
        <div className="space-y-2">
            {Object.entries(data).map(([key, value]) => (
                <div key={key} className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-200">
                    <div className="sm:w-1/4 mr-1 text-lg capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</div>
                    <div className="w-full mt-1 sm:mt-0">{renderValue(value)}</div>
                </div>
            ))}
        </div>
    )
}

export default PropertyValueRenderer

