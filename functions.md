# Functions in experimental_mapper.html

This document lists the JavaScript functions found in `experimental_mapper.html`.

| Function Name                      | Description                                                                 |
| :--------------------------------- | :-------------------------------------------------------------------------- |
| `updateTheme()`                    | Toggles between light and dark mode themes and updates the network style.   |
| `searchGraph()`                    | Searches the network graph for nodes matching the input term.               |
| `resetNodeHighlights()`            | Resets highlights applied to nodes during a search.                         |
| `exportToPNG()`                    | Exports the current network view to a PNG image file.                       |
| `filterIpAndDomains()`             | Hides all nodes except those of type 'ip' or 'domain'.                      |
| `showAllNodes()`                   | Makes all nodes and edges visible in the graph.                             |
| `getNodeColorByType(type)`         | Returns the background color for a node based on its type.                  |
| `enrichAllIpinfo()`                | Performs bulk enrichment of all IP nodes using the IPinfo API.              |
| `processBatch(batch)`              | (Internal helper for `enrichAllIpinfo`) Processes a batch of IP nodes for enrichment. |
| `exportToPDF()`                    | Exports the current network view to a PDF document.                         |
| `saveStateAfterOperation()`        | Saves the current graph state to local storage and shows a toast message.   |
| `window.onload = function()`       | Initialization function called when the page loads.                         |
| `loadState()`                      | Loads the saved graph state from local storage.                             |
| `handleWheel(event)`               | Handles mouse wheel events for zooming (currently commented out).           |
| `throttleRequest(fn)`              | Creates a throttled version of a function to limit request rates.           |
| `ensureInteractionSettings()`      | Ensures the correct interaction settings (dragging, zooming) are applied.   |
| `stabilizeNetwork(skipFit)`        | Stabilizes the network physics and optionally fits the view.                |
| `finishStabilization(resolve, skipFit)` | (Internal helper for `stabilizeNetwork`) Completes the stabilization process. |
| `showEdgeContextMenu(x, y, edgeId)` | Displays a context menu for a specific edge.                                |
| `hideEdgeContextMenu()`            | Hides the edge context menu.                                                |
| `editEdgeLabel(edgeId)`            | Allows editing the label of a specific edge via a prompt.                   |
| `removeEdgeDirect(edgeId)`         | Removes a specific edge directly from the graph.                            |
| `showContextMenu(x, y, value, nodeIds, type)` | Displays a context menu for one or more selected nodes.          |
| `hideContextMenu()`                | Hides the node context menu.                                                |
| `saveState()`                      | Saves the current state of the graph (nodes, edges, settings) to local storage. |
| `searchShodanHtmlHash(htmlHashNodeId, htmlHash, signal)` | (Throttled) Searches Shodan for IPs matching a specific HTML hash. |
| `enrichIP(ip, nodeId)`             | (Throttled) Enriches a single IP node using IPinfo.                         |
| `enrichIPMultiple(ips, nodeIds, signal)` | (Throttled) Enriches multiple IP nodes using IPinfo.                      |
| `enrichShodan(value, nodeId)`      | (Throttled) Enriches a single IP or domain using the Shodan API.            |
| `enrichShodanMultiple(values, nodeIds, signal)` | (Throttled) Enriches multiple IPs or domains using Shodan.       |
| `enrichInternetDB(ip, nodeId)`     | (Throttled) Enriches a single IP using the InternetDB API.                  |
| `enrichInternetDBMultiple(ips, nodeIds, signal)` | (Throttled) Enriches multiple IPs using InternetDB.             |
| `enrichGoogleDNS(domain, nodeId)`  | (Throttled) Enriches a single domain using Google DNS (A records).          |
| `enrichGoogleDNSMultiple(domains, nodeIds, signal)` | (Throttled) Enriches multiple domains using Google DNS (A records). |
| `enrichGoogleDNSMX(domain, nodeId)`| (Throttled) Enriches a single domain using Google DNS (MX records).         |
| `enrichGoogleDNSMXMultiple(domains, nodeIds, signal)` | (Throttled) Enriches multiple domains using Google DNS (MX records). |
| `enrichGoogleDNSTXT(domain, nodeId)`| (Throttled) Enriches a single domain using Google DNS (TXT records).        |
| `enrichGoogleDNSTXTMultiple(domains, nodeIds, signal)` | (Throttled) Enriches multiple domains using Google DNS (TXT records). |
| `enrichHudsonRock(email, nodeId)`  | (Throttled) Enriches a single email address using Hudson Rock API.          |
| `enrichHudsonRockMultiple(emails, nodeIds, signal)` | (Throttled) Enriches multiple email addresses using Hudson Rock. |
| `enrichHudsonRockDomain(domain, nodeId)` | (Throttled) Enriches a single domain using Hudson Rock API.             |
| `enrichHudsonRockDomainMultiple(domains, nodeIds, signal)` | (Throttled) Enriches multiple domains using Hudson Rock. |
| `enrichGreyNoise(ip, nodeId)`      | (Throttled) Enriches a single IP using the GreyNoise API.                   |
| `enrichGreyNoiseMultiple(ips, nodeIds, signal)` | (Throttled) Enriches multiple IPs using GreyNoise.              |
| `sendHttpsRequest(value, type, protocol, nodeId)` | (Throttled) Sends an HTTP(S) request to an IP or domain.       |
| `sendHttpsRequestMultiple(values, type, protocol, signal)` | (Throttled) Sends HTTP(S) requests to multiple IPs or domains. |
| `enrichURLscan(url, nodeId)`       | (Throttled) Enriches a URL/IP/Domain using the URLscan.io API.              |
| `enrichSecurityTrailsDomain(domain, nodeId)` | (Throttled) Enriches a domain for subdomains using SecurityTrails. |
| `enrichSecurityTrailsDomainMultiple(domains, nodeIds, signal)` | (Throttled) Enriches multiple domains using SecurityTrails. |
| `enrichURLhaus(url, nodeId)`       | (Throttled) Enriches a URL using the URLhaus API.                           |
| `enrichURLhausMultiple(urls, nodeIds, signal)` | (Throttled) Enriches multiple URLs using URLhaus.               |
| `startLinkCreation(nodeId)`        | Initiates the process of creating a link starting from a specific node.     |
| `deleteNodes(nodeIds)`             | Deletes one or more specified nodes and their connected edges.              |
| `hidePropertiesPanel()`            | Hides the node properties panel.                                            |
| `showPropertiesPanel(nodeId)`      | Shows the properties panel for a specific node.                             |
| `editNodeNotes(nodeId)`            | Opens the modal to add or edit notes for a specific node.                   |
| `saveNodeNotes()`                  | Saves the notes entered in the notes modal to the selected node.            |
| `hideNotesModal()`                 | Hides the node notes editing modal.                                         |
| `showToast(message, type, duration)` | Displays a temporary notification message (toast).                        |
| `toggleMenu()`                     | Toggles the visibility (collapse/expand) of the controls panel.             |
| `toggleMode()`                     | Switches between light and dark UI modes.                                   |
| `togglePhysics()`                  | Pauses or resumes the physics simulation of the network graph.              |
| `resetLayout()`                    | Resets the network layout using the default physics settings.               |
| `showTab(tabId)`                   | Switches the visible tab in the controls panel.                             |
| `updateAddForm()`                  | Updates the visibility of input fields in the 'Add Entity' form based on type. |
| `updateEditFormVisibility()`       | Updates the visibility of input fields in the 'Edit Entity' form based on type. |
| `addNode()`                        | Adds a new node (entity) to the graph based on the 'Add Entity' form.       |
| `loadNodeForEdit()`                | Loads the data of the selected node into the 'Edit Entity' form.            |
| `editNode()`                       | Saves the changes made to a node in the 'Edit Entity' form.                 |
| `removeNode()`                     | Removes the selected node from the 'Remove Entity' dropdown list.           |
| `addEdge()`                        | Adds a new edge (link) between two selected nodes.                          |
| `removeEdge()`                     | Removes the selected edge from the 'Remove Link' dropdown list.             |
| `updateSelectOptions()`            | Updates the options in all node selection dropdown menus.                   |
| `updateEdgeSelectOptions()`        | Updates the options in the edge removal dropdown menu.                      |
| `exportGraph()`                    | Exports the entire graph (all nodes and edges) to a JSON file.              |
| `exportVisibleGraph()`             | Exports only the currently visible nodes and edges to a JSON file.          |
| `importGraph()`                    | Imports a graph from a selected JSON file.                                  |
| `clearGraph()`                     | Removes all nodes and edges from the graph.                                 |
| `showGraphSummary()`               | Displays a modal summarizing the counts of different node types.            |
| `hideGraphSummary()`               | Hides the graph summary modal.                                              |
| `saveApiKey(keyName, inputId, storeCheckboxId)` | Saves an API key, optionally storing it in local storage.       |
| `saveIpinfoApiKey()`               | Saves the IPinfo API key.                                                   |
| `saveShodanApiKey()`               | Saves the Shodan API key.                                                   |
| `saveGreynoiseApiKey()`            | Saves the GreyNoise API key.                                                |
| `saveUrlscanApiKey()`              | Saves the URLscan.io API key.                                               |
| `saveSecuritytrailsApiKey()`       | Saves the SecurityTrails API key.                                           |
| `saveUrlhausApiKey()`              | Saves the URLhaus API key.                                                  |
| `saveCorsProxyUrl()`               | Saves the CORS proxy URL and related settings.                              |
| `initializeApiKeys()`              | Loads API keys and settings from local storage on startup.                  |
| `runAllTests()`                    | Runs test functions for all configured enrichment APIs.                     |
| `testIpinfo()`                     | Tests the IPinfo API connection and key.                                    |
| `testShodan()`                     | Tests the Shodan API connection and key.                                    |
| `testInternetDB()`                 | Tests the InternetDB API connection.                                        |
| `testGoogleDNS()`                  | Tests the Google DNS API connection.                                        |
| `testHudsonRockEmail()`            | Tests the Hudson Rock Email API connection.                                 |
| `testHudsonRockDomain()`           | Tests the Hudson Rock Domain API connection.                                |
| `testGreyNoise()`                  | Tests the GreyNoise API connection and key.                                 |
| `testURLscan()`                    | Tests the URLscan.io API connection and key.                                |
| `testSecurityTrails()`             | Tests the SecurityTrails API connection and key.                            |
| `testURLhaus()`                    | Tests the URLhaus API connection.                                           |
| `constructUrl(baseUrl, useApiKey)` | Constructs the final URL for an API request, optionally using the proxy.    |
| `enrichAllShodan()`                | Performs bulk enrichment of all IPs/Domains using the Shodan API.           |
| `enrichAllInternetDB()`            | Performs bulk enrichment of all IPs using the InternetDB API.               |
| `enrichAllGoogleDNS()`             | Performs bulk enrichment of all domains using Google DNS (A records).       |
| `enrichAllGoogleDNSMX()`           | Performs bulk enrichment of all domains using Google DNS (MX records).      |
| `enrichAllGoogleDNSTXT()`          | Performs bulk enrichment of all domains using Google DNS (TXT records).     |
| `enrichAllHudsonRockEmails()`      | Performs bulk enrichment of all emails using the Hudson Rock API.           |
| `enrichAllHudsonRockDomains()`     | Performs bulk enrichment of all domains using the Hudson Rock API.          |
| `enrichAllGreyNoise()`             | Performs bulk enrichment of all IPs using the GreyNoise API.                |
| `enrichAllURLscan()`               | Performs bulk enrichment of all URLs/Domains/IPs using URLscan.io.          |
| `enrichAllSecurityTrails()`        | Performs bulk enrichment of all domains using SecurityTrails.               |
| `enrichAllURLhaus()`               | Performs bulk enrichment of all URLs using URLhaus.                         |
| `importIOCsFromText()`             | Imports IOCs (IPs, domains, emails, hashes) from the text area.             |
| `importIOCsFromFile()`             | Imports IOCs from a selected text file.                                     |
| `processIOCs(text)`                | Processes a block of text to extract IOCs and add them to the graph.        |
| `getOrCreateNode(value, type, properties)` | Gets an existing node or creates a new one if it doesn't exist.      |
| `addNodeToGraph(nodeData)`         | Adds a node object to the graph's dataset.                                  |
| `addEdgeToGraph(fromId, toId, label)` | Adds an edge object to the graph's dataset.                             |
| `setOrganicLayout()`               | Applies an organic (force-directed) layout to the graph.                    |
| `setCircularLayout()`              | Applies a circular layout to the graph.                                     |
| `setOrthogonalLayout()`            | Applies an orthogonal layout (experimental, may require tuning).            |
| `setTreeLayout()`                  | Applies a tree layout (experimental, may require tuning).                   |
| `setHierarchicalLayout()`          | Applies a hierarchical layout to the graph.                                 |
| `setLayoutOptions(layoutOptions)`  | Applies specific layout options to the network.                             |
| `toggleNodeLabels()`               | Toggles the visibility of node labels.                                      |
| `toggleEdgeLabels()`               | Toggles the visibility of edge labels.                                      |
| `updateLabelVisibility()`          | Updates the font size for nodes and edges based on visibility settings.     |
| `toggleIsolatedNodes()`            | Toggles the visibility of nodes that have no connections (edges).           |
| `updateNodeSizes(type)`            | Adjusts node sizes based on the number of incoming/outgoing/total links.    |
| `showProgressBar()`                | Shows the progress bar for long-running tasks.                              |
| `completeProgressBar()`            | Hides the progress bar and indicates completion.                            |
| `stopActiveTask()`                 | Attempts to cancel the currently running asynchronous task (e.g., enrichment).|
| `exportConfigBackup()`             | Exports API keys and settings to a JSON backup file.                        |
| `importConfig()`                   | Imports API keys and settings from a JSON backup file.                      |
| `importNMAP()`                     | Imports data from an NMAP XML scan results file.                            |
| `parseNmapXml(xmlString)`          | Parses NMAP XML data and adds corresponding nodes/edges to the graph.       |
| `riskAnalysis()`                   | Performs a risk analysis based on node types and displays results in a modal. |
| `printRiskTable()`                 | Generates a printable version of the risk analysis table.                   | 