<a name="module_sv-api"></a>
## sv-api
Exposes operations supported by StudentVerification RESTful API.Operations are grouped in the following classes:		isirs		documents		requirements


* [sv-api](#module_sv-api)
  * [~isirs](#module_sv-api..isirs)
    * [new isirs()](#new_module_sv-api..isirs_new)
    * [.upload(Root, Authorization, award, content)](#module_sv-api..isirs.upload) ⇒ <code>function</code>
    * [.getCorrections(Root, Authorization, award, content)](#module_sv-api..isirs.getCorrections) ⇒ <code>function</code>
  * [~documents](#module_sv-api..documents)
    * [new documents()](#new_module_sv-api..documents_new)
    * [.getMetadata()](#module_sv-api..documents.getMetadata) ⇒ <code>function</code>
    * [.getFiles()](#module_sv-api..documents.getFiles) ⇒ <code>function</code>
    * [.get()](#module_sv-api..documents.get) ⇒ <code>function</code>
  * [~requirements](#module_sv-api..requirements)
    * [new requirements()](#new_module_sv-api..requirements_new)

<a name="module_sv-api..isirs"></a>
### sv-api~isirs
**Kind**: inner class of <code>[sv-api](#module_sv-api)</code>  

* [~isirs](#module_sv-api..isirs)
  * [new isirs()](#new_module_sv-api..isirs_new)
  * [.upload(Root, Authorization, award, content)](#module_sv-api..isirs.upload) ⇒ <code>function</code>
  * [.getCorrections(Root, Authorization, award, content)](#module_sv-api..isirs.getCorrections) ⇒ <code>function</code>

<a name="new_module_sv-api..isirs_new"></a>
#### new isirs()
Represents functions associated with ISIR files

<a name="module_sv-api..isirs.upload"></a>
#### isirs.upload(Root, Authorization, award, content) ⇒ <code>function</code>
upload a file as application/octet-stream content

**Kind**: static method of <code>[isirs](#module_sv-api..isirs)</code>  
**Returns**: <code>function</code> - A promise.  Any response whose status code is not 2xx will result in a rejected promise.  

| Param | Type | Description |
| --- | --- | --- |
| Root | <code>rootUrl</code> | url of awardletter API |
| Authorization | <code>authorization</code> | header value |
| award | <code>awardYear</code> | year in [YYYY]-[YYYY] format; ex. 2015-2016 |
| content | <code>object</code> | JSON content to be uploaded |

<a name="module_sv-api..isirs.getCorrections"></a>
#### isirs.getCorrections(Root, Authorization, award, content) ⇒ <code>function</code>
Get batched ISIR corrections for a given start date and end date

**Kind**: static method of <code>[isirs](#module_sv-api..isirs)</code>  
**Returns**: <code>function</code> - A promise.  The promise will resolve with an a ZIP file of all corrections. The ZIP file	will contain a folder for each day within the date range whether or not ISIR	corrections were batched for that day. The folder will be named "MM-DD-YYYY".  Any response whose status code is not 2xx will result in a rejected promise.  

| Param | Type | Description |
| --- | --- | --- |
| Root | <code>rootUrl</code> | url of awardletter API |
| Authorization | <code>authorization</code> | header value |
| award | <code>awardYear</code> | year in [YYYY]-[YYYY] format; ex. 2015-2016 |
| content | <code>object</code> | JSON content to be uploaded |

<a name="module_sv-api..documents"></a>
### sv-api~documents
**Kind**: inner class of <code>[sv-api](#module_sv-api)</code>  

* [~documents](#module_sv-api..documents)
  * [new documents()](#new_module_sv-api..documents_new)
  * [.getMetadata()](#module_sv-api..documents.getMetadata) ⇒ <code>function</code>
  * [.getFiles()](#module_sv-api..documents.getFiles) ⇒ <code>function</code>
  * [.get()](#module_sv-api..documents.get) ⇒ <code>function</code>

<a name="new_module_sv-api..documents_new"></a>
#### new documents()
Represents functions associated with student documents

<a name="module_sv-api..documents.getMetadata"></a>
#### documents.getMetadata() ⇒ <code>function</code>
Get student document metadata.

**Kind**: static method of <code>[documents](#module_sv-api..documents)</code>  
**Returns**: <code>function</code> - A promise.		The promise will resolve with the metadata in JSON string format.		Any response with a status code that is not 2xx  will result in a rejected promise.  
<a name="module_sv-api..documents.getFiles"></a>
#### documents.getFiles() ⇒ <code>function</code>
Get student document file(s).

**Kind**: static method of <code>[documents](#module_sv-api..documents)</code>  
**Returns**: <code>function</code> - A promise.		The promise will resolve with an array of unzipped file(s).		Each array element is an object with the following properties:'			{ name: 'file name', type: 'file type', content: file_content }		Any response with a status code that is not 2xx  will result in a rejected promise.  
<a name="module_sv-api..documents.get"></a>
#### documents.get() ⇒ <code>function</code>
Get student document metadata and associated file(s).

**Kind**: static method of <code>[documents](#module_sv-api..documents)</code>  
**Returns**: <code>function</code> - A promise.		The promise resolves to an array of results. The first element will contain		the metadata while the second element will contain the file(s).		Any response with a status code that is not 2xx  will result in a rejected promise.  
<a name="module_sv-api..requirements"></a>
### sv-api~requirements
**Kind**: inner class of <code>[sv-api](#module_sv-api)</code>  
<a name="new_module_sv-api..requirements_new"></a>
#### new requirements()
Represents functions associated with student requirements/tasks

