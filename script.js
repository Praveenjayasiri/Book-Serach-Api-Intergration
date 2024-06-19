
$(document).ready(function() {
    $('#search-button').click(function() {
        var query = $('#search-query').val();
        var apiKey = 'AIzaSyB6CWGWKYquAeSnmqenUcJPutPX3GGKOk0';
        var url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`;

        // Display fetching data text in the results div
        $('#results').html('<p class="col-12">Fetching data...</p>');

        $.ajax({
            url: url,
            method: 'GET',
            success: function(data) {
                $('#results').empty();
                if (data.items) {
                    data.items.forEach(function(item) {
                        var title = item.volumeInfo.title || 'No title';
                        var authors = item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'No authors';
                        var publishedDate = item.volumeInfo.publishedDate || 'No publish date';
                        var isbn = item.volumeInfo.industryIdentifiers ? item.volumeInfo.industryIdentifiers[0].identifier : 'No ISBN';
                        var thumbnail = item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x200?text=No+Image';
                        
                        var price;
                        if (item.saleInfo.listPrice) {
                            price = `${item.saleInfo.listPrice.amount} ${item.saleInfo.listPrice.currencyCode}`;
                        } else {
                            var randomPrice = (Math.random() * (100 - 10) + 10).toFixed(2);
                            price = `$${randomPrice} USD`;
                        }
                        
                        var buyLink = item.saleInfo.buyLink ? `<a href="${item.saleInfo.buyLink}" target="_blank" class="btn btn-success btn-block mb-2">Buy</a>` : `<button class="btn btn-success btn-block mb-2 buy-button" data-title="${title}" data-isbn="${isbn}" data-price="${price}">Purchase</button>`;

                        var bookHtml = `
                            <div class="col-md-3">
                                <div class="card book-card">
                                    <img src="${thumbnail}" class="card-img-top book-img" alt="${title}">
                                    <div class="card-body">
                                        <h5 class="card-title card-title-one-line" data-toggle="tooltip" title="${title}">${title}</h5>
                                        <p class="card-text card-title-one-line" data-toggle="tooltip" title="Authors: ${authors}"><strong>Authors:</strong> ${authors}</p>
                                        <p class="card-text card-title-one-line" data-toggle="tooltip" title="Publish Date: ${publishedDate}"><strong>Publish Date:</strong> ${publishedDate}</p>
                                        <p class="card-text card-title-one-line" data-toggle="tooltip" title="ISBN: ${isbn}"><strong>ISBN:</strong> ${isbn}</p>
                                        <p class="card-text card-title-one-line" data-toggle="tooltip" title="Price: ${price}"><strong>Price:</strong> ${price}</p>
                                        ${buyLink}
                                        <button class="btn btn-primary btn-block add-to-cart" data-title="${title}" data-isbn="${isbn}" data-price="${price}">Add to Cart</button>
                                    </div>
                                </div>
                            </div>
                        `;

                        $('#results').append(bookHtml);
                    });
                } else {
                    $('#results').append('<p class="col-12">No books found.</p>');
                }
                $('#search-query').val('');
            },
            error: function(error) {
                console.error('Error:', error);
                $('#results').empty().append('<p class="col-12 text-danger">Enter book name to fetching the data.</p>');
            }
        });
    });

    // Add to Cart functionality
    $('#results').on('click', '.add-to-cart', function() {
        var title = $(this).data('title');
        var isbn = $(this).data('isbn');
        var price = $(this).data('price');
        alert(`Added "${title}" (ISBN: ${isbn}) to cart at price ${price}.`);
    });

    // Log Purchase Data functionality
    $('#results').on('click', '.buy-button', function() {
        var title = $(this).data('title');
        var isbn = $(this).data('isbn');
        var price = $(this).data('price');
        
        // Log the purchase data to console
        console.log('Purchase Data:', {
            title: title,
            isbn: isbn,
            price: price
        });
    });
});