function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

document.addEventListener('DOMContentLoaded', function() {
    const rangeSlider = document.getElementById('myRange');
    if (isMobileDevice()) {
        rangeSlider.max = 150;  // Set max value for mobile devices
    } else {
        rangeSlider.max = 200; // Set max value for desktop devices
    }
});

const arrayContainer = document.getElementById('arrayContainer');
let array = [];
let bars = [];

//cancel function
var isSorting = false;

function cancel() {
    isSorting = true;
}

//array slider
var slider = document.getElementById("myRange");
var output = document.getElementById("value");
var arraySize = 50; // default array

var timeSlider = document.getElementById("mySpeed");
var timeValue;


slider.oninput = function() {
    arraySize = this.value;
    output.innerHTML = arraySize;
    prevSliderValue = arraySize; // Update previous slider value
    generateArray(arraySize); 
};

timeSlider.oninput = function () {
    timeValue = (this.value) * (-1);
}

// Store previous slider value
let prevSliderValue = arraySize;

function generateArray(size) {
    updateNewArrayData();
    arrayContainer.innerHTML = '';
    array = [];
    bars = [];
    for (let i = 0; i < size; i++) {
        const randomNumber = Math.floor(Math.random() * 500) + 1;
        array.push(randomNumber); 
    }
    console.log('Generated Array:', array); 

    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement('div');
        bar.style.height = `${array[i]}px`;
        bar.classList.add('bar');
        arrayContainer.appendChild(bar);
        bars.push(bar);
    }
    console.log('Bars:', bars); 
}

generateArray(arraySize); // Generate initial array

function tableDataBorder() {
    const tdElements = document.querySelectorAll('td');
    tdElements.forEach(td => {
        td.style.border = '1px solid rgba(113, 231, 170, 0.61)';
    });
}

const sortingAlgorithms = require('./sortdata.json');

function updateTableData(sortName) {
    fetch('sortdata.json')
        .then(response => response.json())
        .then(sortingAlgorithms => {
            const algorithmData = sortingAlgorithms.find(algorithm => algorithm.sortname === sortName);
            tableDataBorder();
            document.getElementById('d1').innerText = algorithmData.best;
            document.getElementById('d2').innerText = algorithmData.avg;
            document.getElementById('d3').innerText = algorithmData.worst;
            document.getElementById('d4').innerText = algorithmData.stability;
        })
        .catch(error => console.error('Error fetching JSON:', error));
}

function updateNewArrayData() {
    const tdElements = document.querySelectorAll('td');
    tdElements.forEach(td => {
        td.style.border = 'none'; 
        td.innerText = '';
    });
}

function disableAllButtons() {
    const buttons = document.querySelectorAll('button:not(#cancelbutton)');
    buttons.forEach(button => {
        button.disabled = true;
    });
    slider.disabled = true;
}

function enableAllButtons() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.disabled = false;
    });
    slider.disabled = false;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Merge Sort
async function mergeSort() {
    isSorting = false;
    updateTableData("Merge Sort");
    disableAllButtons();
    await mergeSortHelper(array, 0, array.length - 1);
    enableAllButtons();
       
}

async function mergeSortHelper(arr, start, end) {
    if (start >= end) {
        return;
    }
    const mid = Math.floor((start + end) / 2);
    await mergeSortHelper(arr, start, mid);
    await mergeSortHelper(arr, mid + 1, end);
    await merge(arr, start, mid, end);
}

async function merge(arr, start, mid, end) {
    if (isSorting) {
        enableAllButtons();
        generateArray(prevSliderValue);
        return;
    }
    const left = arr.slice(start, mid + 1);
    const right = arr.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
        bars[k].style.backgroundColor = 'rgb(51, 255, 53)';
        bars[mid + 1 + j].style.backgroundColor = 'rgb(0, 147, 255)';

        if (left[i] <= right[j]) {
            if (isSorting) {
                enableAllButtons();
                generateArray(prevSliderValue);
                return;
            }
            arr[k] = left[i];
            bars[k].style.height = `${left[i]}px`;
            i++;
        } else {
            arr[k] = right[j];
            bars[k].style.height = `${right[j]}px`;
            j++;
        }
        await sleep(timeValue);
        bars[k].style.backgroundColor = 'red';
        k++;
    }

    while (i < left.length) {
        if (isSorting) {
            enableAllButtons();
            generateArray(prevSliderValue);
            return;
        }
        arr[k] = left[i];
        bars[k].style.height = `${left[i]}px`;
        bars[k].style.backgroundColor = 'rgb(0, 147, 255)';
        await sleep(10);
        bars[k].style.backgroundColor = 'white';
        i++;
        k++;
    }

    while (j < right.length) {
        arr[k] = right[j];
        bars[k].style.height = `${right[j]}px`;
        bars[k].style.backgroundColor = 'white';
        await sleep(10);
        bars[k].style.backgroundColor = 'rgb(51, 255, 53)';
        j++;
        k++;
    }
    bars.forEach(bar => bar.style.backgroundColor = 'white');
}

// Insertion Sort
async function insertionSort() {
    isSorting = false;
    updateTableData("Insertion Sort");
    disableAllButtons();
    for (let i = 1; i < array.length; i++) {
        if (isSorting) {
            enableAllButtons();
            generateArray(prevSliderValue);
            return;
        }
        let key = array[i];
        let j = i - 1;
        bars[i].style.backgroundColor = 'red';

        while (j >= 0 && array[j] > key) {
            if (isSorting) {
                enableAllButtons();
                generateArray(prevSliderValue);
                return;
            }
            array[j + 1] = array[j];
            bars[j + 1].style.height = `${array[j + 1]}px`;
            bars[j + 1].style.backgroundColor = 'red';
            j--;
            await sleep(timeValue); // adjust speed
            bars[j + 1].style.backgroundColor = 'white';
        }
        array[j + 1] = key;
        bars[j + 1].style.height = `${key}px`;
        await sleep(10);
        bars[j + 1].style.backgroundColor = 'white';
    }
    bars.forEach(bar => bar.style.backgroundColor = 'white');
    enableAllButtons();

}

// Quick Sort
async function quickSort() {
    isSorting = false;
    updateTableData("Quick Sort");
    disableAllButtons();
    await quickSortHelper(array, 0, array.length - 1);
}

async function quickSortHelper(arr, low, high) {
    if (low < high) {
        if (isSorting) {
            enableAllButtons();
            generateArray(prevSliderValue);
            return;
        }
        let pivotIndex = await partition(arr, low, high);
        await quickSortHelper(arr, low, pivotIndex - 1);
        await quickSortHelper(arr, pivotIndex + 1, high);
    }
    enableAllButtons();
}

async function partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            if (isSorting) {
                enableAllButtons();
                generateArray(prevSliderValue);
                return;
            }
            i++;
            swap(i, j);
            await sleep(timeValue);
        }
    }
    swap(i + 1, high);
    await sleep(10);
    return i + 1;
}

// Heap Sort
async function heapSort() {
    isSorting = false;
    updateTableData("Heap Sort");
    disableAllButtons();
    let n = array.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        if (isSorting) {
            enableAllButtons();
            generateArray(prevSliderValue);
            return;
        }
        await heapify(n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        if (isSorting) {
            enableAllButtons();
            generateArray(prevSliderValue);
            return;
        }
        swap(0, i);
        await sleep(10);
        await heapify(i, 0);
    }
    enableAllButtons();
}


async function heapify(n, i) {
    disableAllButtons();
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < n && array[left] > array[largest]) {
        largest = left;
    }

    if (right < n && array[right] > array[largest]) {
        largest = right;
    }

    if (largest !== i) {
        swap(i, largest);
        await sleep(timeValue);
        await heapify(n, largest);
    }
    enableAllButtons();
}

function swap(i, j) {
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
    bars[i].style.height = `${array[i]}px`;
    bars[j].style.height = `${array[j]}px`;
    bars[i].style.backgroundColor = 'red';
    bars[j].style.backgroundColor = 'rgb(55, 162, 255)';
    setTimeout(() => {
        bars[i].style.backgroundColor = 'white';
        bars[j].style.backgroundColor = 'white';
    }, 10);
}

// Cocktail Shaker Sort
async function cocktailShakerSort() {
    isSorting = false;
    updateTableData("Cocktail Shaker Sort");
    disableAllButtons();
    let start = 0, end = array.length;
    while (start < end) {
        let swapped = false;
        for (let i = start; i < end - 1; i++) {
            if (array[i] > array[i + 1]) {
                if (isSorting) {
                    enableAllButtons();
                    generateArray(prevSliderValue);
                    return;
                }
                swap(i, i + 1);
                swapped = true;
                await sleep(timeValue);
            }
        }
        end--;
        if (!swapped) break;
        swapped = false;
        for (let i = end - 1; i >= start; i--) {
            if (array[i] > array[i + 1]) {
                swap(i, i + 1);
                swapped = true;
                await sleep(10);
            }
        }
        start++;
        if (!swapped) break;
    }
    enableAllButtons();
}

function updateBars() {
    for (let i = 0; i < array.length; i++) {
        bars[i].style.height = `${array[i]}px`;
    }
}


// Bubble Sort
async function bubbleSort() {
    isSorting = false;
    updateTableData("Bubble Sort");
    disableAllButtons();
    for (let i = 0; i < array.length - 1; i++) {
        if (isSorting) {
            enableAllButtons();
            generateArray(prevSliderValue);
            return;
        }
        for (let j = 0; j < array.length - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                if (isSorting) {
                    enableAllButtons();
                    generateArray(prevSliderValue);
                    return;
                }
                swap(j, j + 1);
                await sleep(timeValue);
            }
        }
    }
    bars.forEach(bar => bar.style.backgroundColor = 'white');
    enableAllButtons();
}

function resetArrayAndSort(sortFunction) {
    generateArray(prevSliderValue); 
    setTimeout(sortFunction, 100);
}

// Odd Even Sort
async function oddEvenSort() {
    isSorting = false;
    updateTableData("Odd Even Sort");
    disableAllButtons();
    let isSorted = false;
    while (!isSorted) {
        isSorted = true;

        // odd index
        for (let i = 1; i <= array.length - 2; i += 2) {
            if (array[i] > array[i + 1]) {
                if (isSorting) {
                    enableAllButtons();
                    generateArray(prevSliderValue);
                    return;
                }
                swap(i, i + 1);
                isSorted = false;
                await sleep(timeValue);
            }
        }
        
        // even index
        for (let i = 0; i <= array.length - 2; i += 2) {
            if (array[i] > array[i + 1]) {
                if (isSorting) {
                    enableAllButtons();
                    generateArray(prevSliderValue);
                    return;
                }
                swap(i, i + 1);
                isSorted = false;
                await sleep(10);
            }
        }
    }
    bars.forEach(bar => bar.style.backgroundColor = 'white');
    enableAllButtons();
}



// Radix MSD Sort
async function radixMSDSort() {
    isSorting = false;
    updateTableData("Radix MSD Sort");
    disableAllButtons();
    let maxDigit = getMaxDigit(array);
    await radixMSDHelper(array, 0, array.length - 1, maxDigit);
    bars.forEach(bar => bar.style.backgroundColor = 'white');
    enableAllButtons();
}

function getMaxDigit(arr) {
    let max = Math.max(...arr);
    let digits = 0;
    
    while (max > 0) {
        if (isSorting) {
            enableAllButtons();
            generateArray(prevSliderValue);
            return;
        }
        digits++;
        max = Math.floor(max / 10);
    }

    return digits;
}

async function radixMSDHelper(arr, low, high, digit) {
    if (low >= high || digit < 0) {
        if (isSorting) {
            enableAllButtons();
            generateArray(prevSliderValue);
            return;
        }
        return;
    }

    const buckets = Array.from({ length: 10 }, () => []);
    const pow10 = Math.pow(10, digit);
    
    for (let i = low; i <= high; i++) {
        if (isSorting) {
            enableAllButtons();
            generateArray(prevSliderValue);
            return;
        }
        const digitValue = Math.floor((arr[i] / pow10) % 10);
        buckets[digitValue].push(arr[i]);
    }
    
    if (isSorting) {
        enableAllButtons();
        generateArray(prevSliderValue);
        return;
    }

    let index = low;
    for (let i = 0; i < buckets.length; i++) {
        for (let j = 0; j < buckets[i].length; j++) {
            arr[index] = buckets[i][j];
            bars[index].style.height = `${arr[index]}px`;

            
            if (digit % 2 === 0) {
                bars[index].style.backgroundColor = 'white';
            } else {
                bars[index].style.backgroundColor = 'red';
            }

            index++;
            await sleep(timeValue);
        }
    }

    index = low;
    for (let i = 0; i < buckets.length; i++) {
        const bucketSize = buckets[i].length;
        if (bucketSize > 1) {
            await radixMSDHelper(arr, index, index + bucketSize - 1, digit - 1);
        }
        index += bucketSize;
    }
}






// Gnome Sort
async function gnomeSort() {
    isSorting = false;
    updateTableData("Gnome Sort");
    disableAllButtons();
    console.log('Starting Gnome Sort...');

    let index = 0;

    while (index < array.length) {
        if (index === 0 || array[index] >= array[index - 1]) {
            index++;
        } else {
            // swap elements
            let temp = array[index];
            array[index] = array[index - 1];
            array[index - 1] = temp;

            if (isSorting) {
                enableAllButtons();
                generateArray(prevSliderValue);
                return;
            }

            // update bars
            bars[index].style.height = `${array[index]}px`;
            bars[index - 1].style.height = `${array[index - 1]}px`;
            bars[index].style.backgroundColor = 'red';
            bars[index - 1].style.backgroundColor = 'rgb(0, 147, 255)';
            await sleep(timeValue); 
            bars[index].style.backgroundColor = 'white';
            bars[index - 1].style.backgroundColor = 'white';

            index--;
        }
    }

    console.log('Gnome Sort Completed.');
    enableAllButtons();
}

// Shell Sort
async function shellSort() {
    isSorting = false;
    if (isSorting) {
        enableAllButtons();
        generateArray(prevSliderValue);
        return;
    }
    updateTableData("Shell Sort");
    disableAllButtons();
    console.log('Starting Shell Sort...');

    const n = array.length;
    let gap = Math.floor(n / 2);

    while (gap > 0) {
        for (let i = gap; i < n; i++) {
            let temp = array[i];
            let j = i;
            
            if (isSorting) {
                enableAllButtons();
                generateArray(prevSliderValue);
                return;
            }

            
            while (j >= gap && array[j - gap] > temp) {
                array[j] = array[j - gap];
                
                if (isSorting) {
                    enableAllButtons();
                    generateArray(prevSliderValue);
                    return;
                }

                
                bars[j].style.height = `${array[j]}px`;
                bars[j - gap].style.height = `${temp}px`;
                bars[j].style.backgroundColor = 'red';
                bars[j - gap].style.backgroundColor = 'rgb(0, 147, 255)';
                await sleep(timeValue); 
                bars[j].style.backgroundColor = 'white';
                bars[j - gap].style.backgroundColor = 'white';

                j -= gap;
            }

            array[j] = temp;
        }
        gap = Math.floor(gap / 2);
    }

    console.log('Shell Sort Completed.');
    enableAllButtons();
}

// Selection Sort
async function selectionSort() {
    isSorting = false;
    if (isSorting) {
        enableAllButtons();
        generateArray(prevSliderValue);
        return;
    }
    updateTableData("Selection Sort");
    disableAllButtons();
    console.log('Starting Selection Sort...');

    const n = array.length;

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;

        
        for (let j = i + 1; j < n; j++) {
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
            if (isSorting) {
                enableAllButtons();
                generateArray(prevSliderValue);
                return;
            }
        }

        
        if (minIndex !== i) {
            let temp = array[i];
            array[i] = array[minIndex];
            array[minIndex] = temp;

            
            bars[i].style.height = `${array[i]}px`;
            bars[minIndex].style.height = `${temp}px`;
            bars[i].style.backgroundColor = 'red';
            bars[minIndex].style.backgroundColor = 'rgb(0, 147, 255)';
            await sleep(timeValue); 
            bars[i].style.backgroundColor = 'white';
            bars[minIndex].style.backgroundColor = 'white';
        }
    }

    console.log('Selection Sort Completed.');
    enableAllButtons();
}

document.querySelector('button.mergeSort').addEventListener('click', () => resetArrayAndSort(mergeSort));
document.querySelector('button.insertionSort').addEventListener('click', () => resetArrayAndSort(insertionSort));
document.querySelector('button.heapSort').addEventListener('click', () => resetArrayAndSort(heapSort));
document.querySelector('button.bubbleSort').addEventListener('click', () => resetArrayAndSort(bubbleSort));
document.querySelector('button.quickSort').addEventListener('click', () => resetArrayAndSort(quickSort)); 
document.querySelector('button.cocktailShakerSort').addEventListener('click', () => resetArrayAndSort(cocktailShakerSort)); 
document.querySelector('button.oddEvenSort').addEventListener('click', () => resetArrayAndSort(oddEvenSort)); 
document.querySelector('button.radixMSDSort').addEventListener('click', () => resetArrayAndSort(radixMSDSort)); 
document.querySelector('button.gnomeSort').addEventListener('click', () => resetArrayAndSort(gnomeSort)); 
document.querySelector('button.shellSort').addEventListener('click', () => resetArrayAndSort(shellSort)); 
document.querySelector('button.selectionSort').addEventListener('click', () => resetArrayAndSort(selectionSort)); 
document.querySelector('button.generateArray').addEventListener('click', () => {
    generateArray(prevSliderValue); 
    resetBars(); 
     
});
document.getElementById('cancelbutton').addEventListener('click', cancel);