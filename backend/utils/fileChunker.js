/**
 * File Chunking Utility for AS400 Source Files
 * Splits large source files into manageable chunks for AI processing
 */

/**
 * Configuration for chunking
 */
const CHUNK_CONFIG = {
    MAX_LINES_PER_CHUNK: 200,        // Maximum lines per chunk
    MAX_CHARS_PER_CHUNK: 8000,       // Maximum characters per chunk
    OVERLAP_LINES: 10,                // Number of overlapping lines between chunks
    MIN_CHUNK_SIZE: 50                // Minimum lines to create a chunk
};

/**
 * Split file content into chunks based on lines and character limits
 * @param {string} content - The file content to chunk
 * @param {string} fileName - Name of the file being chunked
 * @returns {Array} Array of chunk objects
 */
function chunkFileContent(content, fileName = 'unknown') {
    console.log('\n🔪 ===== FILE CHUNKING STARTED =====');
    console.log(`📄 File: ${fileName}`);
    console.log(`📏 Total size: ${content.length} characters`);

    const lines = content.split('\n');
    console.log(`📝 Total lines: ${lines.length}`);

    // If file is small enough, return as single chunk
    if (lines.length <= CHUNK_CONFIG.MAX_LINES_PER_CHUNK &&
        content.length <= CHUNK_CONFIG.MAX_CHARS_PER_CHUNK) {
        console.log('✅ File is small enough - no chunking needed');
        console.log('🔪 ===== CHUNKING COMPLETED =====\n');
        return [{
            chunkIndex: 0,
            totalChunks: 1,
            startLine: 1,
            endLine: lines.length,
            lineCount: lines.length,
            charCount: content.length,
            content: content,
            fileName: fileName,
            isComplete: true
        }];
    }

    console.log('⚠️  File exceeds limits - chunking required');
    console.log(`   Max lines per chunk: ${CHUNK_CONFIG.MAX_LINES_PER_CHUNK}`);
    console.log(`   Max chars per chunk: ${CHUNK_CONFIG.MAX_CHARS_PER_CHUNK}`);
    console.log(`   Overlap lines: ${CHUNK_CONFIG.OVERLAP_LINES}`);

    const chunks = [];
    let currentLine = 0;
    let chunkIndex = 0;

    while (currentLine < lines.length) {
        const startLine = currentLine;
        let endLine = Math.min(currentLine + CHUNK_CONFIG.MAX_LINES_PER_CHUNK, lines.length);

        // Extract chunk lines
        let chunkLines = lines.slice(startLine, endLine);
        let chunkContent = chunkLines.join('\n');

        // If chunk exceeds character limit, reduce it
        while (chunkContent.length > CHUNK_CONFIG.MAX_CHARS_PER_CHUNK && chunkLines.length > CHUNK_CONFIG.MIN_CHUNK_SIZE) {
            endLine--;
            chunkLines = lines.slice(startLine, endLine);
            chunkContent = chunkLines.join('\n');
        }

        const chunk = {
            chunkIndex: chunkIndex,
            totalChunks: 0, // Will be updated after all chunks are created
            startLine: startLine + 1, // 1-indexed for display
            endLine: endLine,
            lineCount: chunkLines.length,
            charCount: chunkContent.length,
            content: chunkContent,
            fileName: fileName,
            isComplete: false
        };

        chunks.push(chunk);

        console.log(`\n📦 Chunk ${chunkIndex + 1} created:`);
        console.log(`   Lines: ${chunk.startLine} - ${chunk.endLine} (${chunk.lineCount} lines)`);
        console.log(`   Size: ${chunk.charCount} characters`);
        console.log(`   Preview: ${chunkContent.substring(0, 100).replace(/\n/g, ' ')}...`);

        // Move to next chunk with overlap
        currentLine = endLine - CHUNK_CONFIG.OVERLAP_LINES;

        // Prevent infinite loop
        if (currentLine <= startLine) {
            currentLine = endLine;
        }

        chunkIndex++;
    }

    // Update total chunks count
    chunks.forEach(chunk => {
        chunk.totalChunks = chunks.length;
        chunk.isComplete = (chunk.chunkIndex === chunks.length - 1);
    });

    console.log(`\n✅ Chunking completed: ${chunks.length} chunks created`);
    console.log('🔪 ===== CHUNKING COMPLETED =====\n');

    return chunks;
}

/**
 * Process chunks sequentially with AI
 * @param {Array} chunks - Array of chunk objects
 * @param {Function} processingFunction - Function to process each chunk
 * @returns {Array} Array of processing results
 */
async function processChunksSequentially(chunks, processingFunction) {
    console.log('\n🤖 ===== CHUNK PROCESSING STARTED =====');
    console.log(`📊 Total chunks to process: ${chunks.length}`);

    const results = [];

    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        console.log(`\n🔄 Processing chunk ${i + 1}/${chunks.length}...`);
        console.log(`   Lines: ${chunk.startLine} - ${chunk.endLine}`);
        console.log(`   Size: ${chunk.charCount} characters`);

        try {
            const startTime = Date.now();
            const result = await processingFunction(chunk, i);
            const duration = Date.now() - startTime;

            console.log(`   ✅ Chunk ${i + 1} processed successfully in ${duration}ms`);

            results.push({
                chunkIndex: i,
                success: true,
                result: result,
                duration: duration
            });
        } catch (error) {
            console.error(`   ❌ Chunk ${i + 1} processing failed:`, error.message);

            results.push({
                chunkIndex: i,
                success: false,
                error: error.message,
                duration: 0
            });
        }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

    console.log(`\n📈 Processing Summary:`);
    console.log(`   ✅ Successful: ${successCount}/${chunks.length}`);
    console.log(`   ❌ Failed: ${failCount}/${chunks.length}`);
    console.log(`   ⏱️  Total time: ${totalDuration}ms`);
    console.log(`   ⚡ Average time per chunk: ${Math.round(totalDuration / chunks.length)}ms`);
    console.log('🤖 ===== CHUNK PROCESSING COMPLETED =====\n');

    return results;
}

/**
 * Merge results from multiple chunks
 * @param {Array} chunkResults - Array of results from chunk processing
 * @returns {Object} Merged result
 */
function mergeChunkResults(chunkResults) {
    console.log('\n🔗 ===== MERGING CHUNK RESULTS =====');
    console.log(`📊 Merging ${chunkResults.length} chunk results...`);

    const successfulResults = chunkResults.filter(r => r.success);

    if (successfulResults.length === 0) {
        console.log('❌ No successful chunks to merge');
        console.log('🔗 ===== MERGING FAILED =====\n');
        return null;
    }

    // For now, return the first successful result
    // In a more sophisticated implementation, you would merge schemas, combine data, etc.
    console.log(`✅ Using result from chunk ${successfulResults[0].chunkIndex + 1}`);
    console.log('🔗 ===== MERGING COMPLETED =====\n');

    return successfulResults[0].result;
}

/**
 * Get chunking statistics
 * @param {Array} chunks - Array of chunk objects
 * @returns {Object} Statistics object
 */
function getChunkingStats(chunks) {
    const totalLines = chunks.reduce((sum, chunk) => sum + chunk.lineCount, 0);
    const totalChars = chunks.reduce((sum, chunk) => sum + chunk.charCount, 0);
    const avgLinesPerChunk = Math.round(totalLines / chunks.length);
    const avgCharsPerChunk = Math.round(totalChars / chunks.length);

    return {
        totalChunks: chunks.length,
        totalLines: totalLines,
        totalChars: totalChars,
        avgLinesPerChunk: avgLinesPerChunk,
        avgCharsPerChunk: avgCharsPerChunk,
        largestChunk: Math.max(...chunks.map(c => c.charCount)),
        smallestChunk: Math.min(...chunks.map(c => c.charCount))
    };
}

module.exports = {
    chunkFileContent,
    processChunksSequentially,
    mergeChunkResults,
    getChunkingStats,
    CHUNK_CONFIG
};
